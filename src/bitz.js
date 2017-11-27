const request = require('request');
const crypto = require('crypto');
const nonce = require('nonce');
const config = require('config');

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


exports.sell = function(price, amount) {
  console.log("selling " + amount.toString() + " for " + price.toString());
  var bitzConfig = config.get('bitz');
  var form = {
    api_key: bitzConfig.get('apiKey'),
    timestamp: Math.round((new Date()).getTime() / 1000),
    nonce: "309127",
    type: "out",
    price: price, 
    number: amount,
    coin: "ark_btc",
    tradepwd: bitzConfig.get('tradePassword')
  };

  var secret_key = bitzConfig.get('secretKey');
  //var s = "api_key = "+form.api_key+" & coin = "+form.coin+" & nonce = "+form.nonce+" & number = "+form.number+" & price = "+form.price+" & timestamp = "+form.timestamp+" & tradepwd = "+form.tradepwd+" & type = "+form.type;
  var s = "api_key="+form.api_key+"&coin="+form.coin+"&nonce="+form.nonce+"&number="+form.number+"&price="+form.price+"&timestamp="+form.timestamp+"&tradepwd="+form.tradepwd+"&type="+form.type;

  const hmac = crypto.createHash('md5');
  hmac.update(s);
  form.sign = hmac.digest('hex');

  console.log(s);
  console.log(form);
  console.log("querying API");
  request.post({url: "https://www.bit-z.com/api_v1/tradeAdd", form: form}, function(err, res, body) {
   console.log(body);
    
  });

};
