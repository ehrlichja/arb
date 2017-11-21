const request = require('request');
const order = require('./order.js');

var exports = module.exports = {};

exports.openBitz = function(insert) {

  var pollIntervalMs = 1000;

  setInterval(function() {
 
   var parse = function(err, res, body) {
     parseBitz(err, res, body, insert);
   };

    request("https://www.bit-z.com/api_v1/orders?coin=ark_btc", { json: true }, parse);
  }, pollIntervalMs);

};


var parseBitz = function(err, res, body, insert) {
  
  if (body['data'] != undefined) {
    var d = body['data']['d'];

    var buys = d.filter(function(order) {
      return order['s'] == 'buy';
    }).map(function(buy) {
      return new order.Order(new Date(), 3, 1, 'BUY', buy['p'], buy['n']);
    });
  
    var sells = d.filter(function(order) {
      return order['s'] == 'sell';
    }).map(function(sell) {
      return new order.Order([new Date(), 3, 1, 'SELL', sell['p'], sell['n']]);
    });
  
    insert(sells);
    insert(buys);
  };

};
