const request = require('request');
const crypto = require('crypto');
const nonce = require('nonce')();
const config = require('config');

const order = require('./order.js');

var exports = module.exports = {};

exports.openCoingi = function(insert) {

  var pollIntervalMs = 1000;

  setInterval(function() {
    var parse = function(err, res, body) {
      parseCoingi(err, res, body, insert);
    };

    request("https://api.coingi.com/current/order-book/vtc-btc/200/200/32", {json: true}, parse)
  }, pollIntervalMs);

};

var parseCoingi = function(err, res, body, insert) {

  var bids = body['bids'].map(function(bid) {
    return new order.Order(new Date(), 4, 2, 'BUY', bid['price'], bid['baseAmount']);
  });

  var asks = body['asks'].map(function(bid) {
    return new order.Order(new Date(), 4, 2, 'SELL', bid['price'], bid['baseAmount']);
  });

  insert(bids);
  insert(asks);

};

exports.sell = function(amount, pair) {

  var coingiConfig = config.get('coingi');
  var api_key = coingiConfig.get('apiKey');
  var api_secret = coingiConfig.get('secret');
  var this_nonce = Math.floor(Math.random()*8999999999999999999+1000000000000000000);
  var this_sig = this_nonce+'$'+api_key;
   
  var hmac = crypto.createHmac('sha256', api_secret);  
  hmac.update(this_sig);

  var form = {
    id: 'abc-1',
    type: 1,
    timestamp: new Date().getTime() / 1000,
    currencyPair: 'vtc-btc',
    price: 100000,
    volume: 1,
    signature: hmac.digest('hex'),
    token: api_key,
    nonce: this_nonce
  };
 
  console.log(form);

  request.post({url: 'https://api.coingi.com/user/add-order', json:  form}, function(err, res, body) {
   console.log(err);
   console.log(body);
  });

};
