const request = require('request');
const order = require('./order.js');
const md5 = require('md5');

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


exports.sell = function(price, amount) {
  console.log("selling " + amount.toString() + " for " + price.toString());
  var form = {
    api_key: "ed3b22b91f10a640965f75a02f3bb3ec",
    timestamp: Math.round((new Date()).getTime() / 1000),
    nonce: "2jnd84",
    type: "sell",
    price: price, 
    number: amount,
    coin: "ark_btc",
    tradepwd: "kgbd"
  };

  var s = "api_key="+form.api_key+"&coin="+form.coin+"&nonce="+form.nonce+"&type="+form.type+"&number="+form.number+"&price="+form.price+"&timestamp="+form.timestamp+"&tradepwd="+form.tradepwd;
  form.sign = md5(s) 

  console.log(form);
  request.post({url: "https://www.bit-z.com/api_v1/tradeAdd", form: form, function(err, res, body) {
    console.log("!!");
    console.log(err);
    console.log(res);
    console.log(body);
  }});

};
