const orders = {
  1: {
    amount: 1000,
    currency: 'TWD',
    packages: [
      {
        id: 'products_1',
        amount: 1000,
        products: [
          {
            name: '六角棒棒',
            quantity: 1,
            price: 1000
          }
        ]
      }
    ]
  },
  2: {
    amount: 2000,
    currency: 'TWD',
    packages: [
      {
        id: 'products_2',
        amount: 2000,
        products: [
          {
            name: '脆迪蘇',
            quantity: 2,
            price: 1000
          }
        ]
      }
    ]
  },
  3: {
    amount: 1500,
    currency: 'TWD',
    packages: [
      {
        id: 'products_3',
        amount: 2000,
        products: [
          {
            name: '奶油口味乖乖餅',
            quantity: 2,
            price: 1000
          }
        ]
      }
    ]
  }
};


module.exports = orders;