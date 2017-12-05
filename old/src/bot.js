const bittrex = require('./bittrex.js')
const coingi = require('./coingi.js')
const order = require('./order.js');

var lowestBittrexSell = 0.0;
var highestCoingiBuy = 0.0;

var insertCoingi = function(data) {
  var coingiBuys = data.filter(function(order) {
    return order.exchange_id == "COINGI";
  }).filter(function(order) {
    return order.order_type == "BUY";
  });
  if (coingiBuys.length > 0) {
    coingiBuys.sort(function(a, b) { a.price > b.price })[0];
    highestCoingiBuy = coingiBuys[0].price; 
  }

};

var insertBittrex = function(data) {
  var bittrexSells = data.filter(function(order) {
    return order.exchange_id == "BITTREX"; 
  }).filter(function(order) {
    return order.order_type == 'SELL';
  });

  if (bittrexSells.length > 0) {
    bittrexSells.sort(function(a, b) { a.price < b.price })[0];
    lowestBittrexSell = bittrexSells[0].price;
  };

};

bittrex.openBittrex('BTC-VTC', insertBittrex);
coingi.openCoingi('vtc-btc', insertCoingi);

var myCoingiSellOrder = 0;
setInterval(function() {
  myCoingiSellOrder = lowestBittrexSell * 1.05;

  if (highestCoingiBuy > myCoingiSellOrder) {
    var profit = highestCoingiBuy - lowestBittrexSell;
    console.log("Opening coingi sell order for " + myCoingiSellOrder);
    console.log("Opening bittrex buy order for " + lowestBittrexSell);
  }

}, 210);

