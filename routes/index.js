const hmacSHA256 = require('crypto-js/hmac-sha256');
const Base64 = require('crypto-js/enc-base64');
const express = require("express");
const router = express.Router();
const sampleData = require("../sample/sampleData");
const axios = require("axios");
const orders = {};
require("dotenv").config();
const {
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_SECRET_KEY,
  LINEPAY_RETURN_CANCEL_URL,
  LINEPAY_RETURN_CONFIRM_URL,
  LINEPAY_RETURN_HOST,
  LINEPAY_SITE,
  LINEPAY_VERSION,
} = process.env;
/* GET home page. */
router
  .get("/", function (req, res, next) {
    const order = sampleData;
    var OrderCount = Object.keys(order).length;
    console.log(order[1])
    res.render("index", {title:'首頁',order,OrderCount});
  })
  .get("/checkout/:ProdcutId", (req, res) => {
    const { ProdcutId } = req.params;
    const order = sampleData[ProdcutId];
    order.orderId = parseInt(new Date().getTime() / 1000); //由於沒有UUID 由時間代替UUID
    orders[order.orderId] = order;
    console.log(order)
    res.render("checkout", { order });
  });
router
  .post("/createOrder/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const order = orders[orderId];
  try {
    const linePayBody = {
      ...order,
      currency: "TWD",
      redirectUrls: {
        confirmUrl: `${LINEPAY_RETURN_HOST}${LINEPAY_RETURN_CONFIRM_URL}`,
        cancelUrl: `${LINEPAY_RETURN_HOST}${LINEPAY_RETURN_CANCEL_URL}`,
      },
    };
    const uri = "/payments/request";
    const headers = createSignature(uri, linePayBody);
    const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
    const linePayRes = await axios.post(url, linePayBody, { headers });
    console.log(linePayRes.data.info)
    if(linePayRes?.data?.returnCode==='0000')
    {
      res.redirect(linePayRes?.data?.info.paymentUrl.web)
    }
  } catch (error) {
    console.log("錯誤訊息:", error);
    //錯誤的回饋
    res.end();
  }
})
  .get('/linePay/confirm',async(req,res)=>{
    const {transactionId,orderId}=req.query;
    const order=orders[orderId]
    try {
      const uri = `/payments/${transactionId}/confirm`;
      const linePayBody = {
        amount: order.amount,
        currency: 'TWD',
      }
      const headers = createSignature(uri, linePayBody);
      const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
      const linePayRes = await axios.post(url, linePayBody, { headers });
      res.render("tradesuccess", { order });
    } catch (error) {
      console.log(error)
      res.end();
    }
      })
  
  function createSignature(uri, linePayBody) {
    const nonce = parseInt(new Date().getTime());
    const string = `${LINEPAY_CHANNEL_SECRET_KEY}/${LINEPAY_VERSION}${uri}${JSON.stringify(
      linePayBody
    )}${nonce}`;
    const signature = Base64.stringify(
      hmacSHA256(string, LINEPAY_CHANNEL_SECRET_KEY)
    );
    const headers = {
      "X-LINE-ChannelId": LINEPAY_CHANNEL_ID,
      "Content-Type": "application/json",
      "X-LINE-Authorization-Nonce": nonce,
      "X-LINE-Authorization": signature,
    };
    return headers;
  }
  function getHsonLength(json){
    var jsonLength=0;
    for (var i in json) {
        jsonLength++;
    }
    return jsonLength;
}

module.exports = router;
