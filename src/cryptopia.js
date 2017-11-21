const request = require('request');
const order = require('./order.js');

var exports = module.exports = {};

exports.openCryptopia = function(insert) {

  var pollIntervalMs = 1000;

  setInterval(function() {

    var parse = function(err, res, body) {
      parseCryptopiaChunk(err, res, body, insert)
    };

    request('https://www.cryptopia.co.nz/api/GetMarketOrders/ARK_BTC', { json: true }, parse);
  }, pollIntervalMs);

};


var parseCryptopiaChunk = function(err, res, body, insert) {
  if (err) { return console.log(err); }

  var exchangeId = 2

  var buys = body['Data']['Buy'].map(function(order) {
    return new order.Order(new Date(), exchangeId, 1, 'BUY', order['Price'], order['Volume']);
  });

  var sells = body['Data']['Sell'].map(function(order) {
    return new order.Order(new Date(), exchangeId, 1, 'SELL', order['Price'], order['Volume']);
  });

  if (sells.length > 1) {
    insert(sells);
  };

  if (buys.length > 1) {
    insert(buys);
  };


};
