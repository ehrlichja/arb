const request = require('request-promise');
const crypto = require('crypto');
const nonce = require('nonce')();
const config = require('config');

const constants = require('./constants.js');
const order = require('./order.js');

var exports = module.exports = {};

exports.openCoingi = function(pair, insert) {

  var pollIntervalMs = 210;

  setInterval(function() {
    var parse = function(err, res, body) {
      parseCoingi(err, res, body, insert, pair);
    };

    request("https://api.coingi.com/current/order-book/" + pair  + "/200/200/32", {json: true}, parse)
  }, pollIntervalMs);

};

var parseCoingi = function(err, res, body, insert, pair) {
  var exchange_name = "COINGI";
  var pair_id = constants.pair_id(pair);

  var bids = body['bids'].map(function(bid) {
    return new order.Order(new Date(), exchange_name, pair_id, 'BUY', bid['price'], bid['baseAmount']);
  });

  var asks = body['asks'].map(function(bid) {
    return new order.Order(new Date(), exchange_name, pair_id, 'SELL', bid['price'], bid['baseAmount']);
  });

  insert(bids);
  insert(asks);

};

var sign = function(form) {
  var coingi_config = config.get('coingi');
  var api_key = coingi_config.get('apiKey');
  var api_secret = coingi_config.get('secretKey');
  var nonce = Math.floor(Math.random()*8999999999999999999+1000000000000000000);
  console.log(api_secret);
  
  var hmac = crypto.createHmac('sha256', api_secret);  
  hmac.update(nonce+'$'+api_key);
  var sig = hmac.digest('hex');
  form.token = api_key;
  form.nonce = nonce;
  form.signature = sig;
  return form;
};

exports.createOrder = function(type, price, volume, pair) {
  var form = {
    id: 'abc-1',
    type: type,
    timestamp: Math.round(new Date().getTime() / 1000, 0),
    currencyPair: pair,
    price: price,
    volume: volume
  };
 
  var signedForm = sign(form);
 
  console.log(signedForm);

  return request.post({url: 'https://api.coingi.com/user/add-order', json: signedForm});

};

exports.cancelOrder = function(orderId) {
  var form = {
    orderId: orderId
  };
 
  var signedForm = sign(form);
 
  console.log(signedForm);

  request.post({url: 'https://api.coingi.com/user/cancel-order', json: signedForm}, function(err, res, body) {
   console.log(err);
   console.log(body);
  });
};
