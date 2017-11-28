const bittrex = require('node-bittrex-api');
const order = require('./order.js');
const constants = require('./constants.js');
const config = require('config');
const Promise = require('bluebird');
const tradebuy = Promise.promisify(bittrex.tradebuy);

var exports = module.exports = {};

var bittrexConfig = config.get("bittrex");

bittrex.options({
  'apikey' : bittrexConfig.get('apiKey'),
  'apisecret' : bittrexConfig.get("apiSecret")
});

exports.openBittrex = function(pair, insert) {
  bittrex.websockets.client(function() {
    console.log("websocket connected");
    var parse = function(data) {
      parseBittrex(data, insert, pair)
    }
    bittrex.websockets.subscribe([pair], parse);
  });
};

/*
Type 0 – you need to add this entry into your orderbook. There were no orders at matching price before.
Type 1 – you need to delete this entry from your orderbook. This entry no longer exists (no orders at matching price)
Type 2 – you need to edit this entry. There are different number of orders at this price
*/

var parseBittrex = function(data, insert, pair) {
  if (data.M == "updateExchangeState") {

    var exchange_name = "BITTREX";

    var pair_id = constants.pair_id(pair);

    var sells = data.A[0]['Sells']
    .filter(function(sale) {
      return sale['Type'] == '0';
    }).map(function(sale) {
      return new order.Order(new Date(), exchange_name, pair_id, 'SELL', sale['Rate'], sale['Quantity']);
    });

    var buys = data.A[0]['Buys']
    .filter(function(buy) {
      return buy['Type'] == '0';
    }).map(function(buy) {
      return new order.Order(new Date(), exchange_name, pair_id, 'BUY', buy['Rate'], buy['Quantity']);
    });

    if (sells.length > 0) {
      insert(sells);
    };

    if (buys.length > 0) {
      insert(buys);
    };

  };
};

exports.createBuyOrder = function(price, volume, pair) {
  return tradebuy({
    MarketName: pair,
    OrderType: 'LIMIT',
    Quantity: volume,
    Rate: price,
    TimeInEffect: 'GOOD_TIL_CANCELLED', // supported options are 'IMMEDIATE_OR_CANCEL', 'GOOD_TIL_CANCELLED', 'FILL_OR_KILL'
    ConditionType: 'NONE', // supported options are 'NONE', 'GREATER_THAN', 'LESS_THAN'
    Target: 0 // used in conjunction with ConditionType
  });
};

exports.cancelOrder = function(orderId) {
  console.log("cancelling order " + orderId);
  bittrex.cancel({uuid: orderId}, function(data, err) {
    console.log(data);
    console.log(err);
  });
}
