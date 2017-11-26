const bittrex = require('./bittrex.js')
const bitz = require('./bitz.js')
const order = require('./order.js');

var highestBitzBuy = 0.0;
var lowestBittrexSell = 0.0;

var insertBitz = function(data) {

  var bitzBuys = data.filter(function(order) {
    return order.exchange_id == 3; // bitz
  }).filter(function(order) {
    return order.order_type == 'BUY';
  });


  if (bitzBuys.length > 0) {
    bitzBuys.sort(function(a, b) { a.price < b.price })[0];
    // console.log("lowest buy: " + bitzBuys[0]);
    // console.log("highest buy: " + bitzBuys[bitzBuys.length - 1]);
    highestBitzBuy = bitzBuys[bitzBuys.length - 1].price;
  };


};

var insertBittrex = function(data) {

  var bittrexSells = data.filter(function(order) {
    return order.exchange_id == 1; // bittrex
  }).filter(function(order) {
    return order.order_type == 'SELL';
  });

  if (bittrexSells.length > 0) {
    bittrexSells.sort(function(a, b) { a.price < b.price })[0];
    lowestBittrexSell = bittrexSells[0].price;
  };

};

bittrex.openBittrex(insertBittrex);
bitz.openBitz(insertBitz);

setInterval(function() {
  var spread = highestBitzBuy - lowestBittrexSell;
  if (spread > 0) {
    console.log("buy: " + highestBitzBuy.toString() + " sell: " + lowestBittrexSell.toString() + " spread: " + spread.toString());
    console.log("TRADE!");
  };
}, 100);

