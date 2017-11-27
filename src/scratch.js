const request = require('request');

const bitz = require('./bitz.js');
const coingi = require('./coingi.js');

coingi.createOrder(1, 0.07, 10, 'vtc-btc');
//coingi.cancelOrder('abc-1');

//bitz.sell(0.0004, 2)
/*
request.post('http://www.google.com', function(err, res, body) {
  console.log(res);
});
*/
