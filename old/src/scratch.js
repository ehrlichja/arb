const request = require('request');

/* Exchanges */
const bittrex = require('./bittrex.js')
const cryptopia = require('./cryptopia.js')
const bitz = require('./bitz.js')
const coingi = require('./coingi.js');

bittrex.createBuyOrder(0.0001, 5, "BTC-VTC").then(function(result) {
  console.log("!!!");
}).catch(function(err) {
  var orderId = err.result.OrderId;
  console.log("created order id " + orderId);
  bittrex.cancelOrder(orderId);
});



/*
coingi.createOrder(1, 0.1, 4.99, 'vtc-btc').then(function(result) {
  console.log(result.result);
  var orderId = result.result;
  coingi.cancelOrder(orderId);
});
*/




//bitz.sell(0.0004, 2)
/*
request.post('http://www.google.com', function(err, res, body) {
  console.log(res);
});
*/