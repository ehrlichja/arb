const bittrex = require('node-bittrex-api');
const order = require('./order.js');

var exports = module.exports = {};

exports.openBittrex = function(insert) {
  bittrex.websockets.client(function() {
    console.log("websocket connected");
    var parse = function(data) {
      parseBittrexChunk(data, insert)
    }
    bittrex.websockets.subscribe(['BTC-ARK'], parse);
  });
};

/*
Type 0 – you need to add this entry into your orderbook. There were no orders at matching price before.
Type 1 – you need to delete this entry from your orderbook. This entry no longer exists (no orders at matching price)
Type 2 – you need to edit this entry. There are different number of orders at this price
*/

var parseBittrexChunk = function(data, insert) {
  if (data.M == "updateExchangeState") {

    var exchangeId = 1

    var sells = data.A[0]['Sells']
    .filter(function(sale) {
      return sale['Type'] == '0';
    }).map(function(sale) {
      return new order.Order(new Date(), exchangeId, 1, 'SELL', sale['Rate'], sale['Quantity']);
    });

    var buys = data.A[0]['Buys']
    .filter(function(buy) {
      return buy['Type'] == '0';
    }).map(function(buy) {
      return new order.Order(new Date(), exchangeId, 1, 'BUY', buy['Rate'], buy['Quantity']);
    });

    if (sells.length > 0) {
      insert(sells);
    };

    if (buys.length > 0) {
      insert(buys);
    };

  };
};
