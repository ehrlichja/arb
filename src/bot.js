const bittrex = require('./bittrex.js')
const bitz = require('./bitz.js')
const order = require('./order.js');

var highestBitzBuy = 0.0;
var lowestBittrexSell = 0.0;

var insert = function(data) {

  var bitzBuys = data.filter(function(order) {
    return order[1] == 3; // bitz
  }).filter(function(order) {
    return order[3] == 'BUY';
  });

  var bittrexSells = data.filter(function(order) {
    return order[1] == 1; // bittrex
  }).filter(function(order) {
    return order[3] == 'SELL';
  });

  if (bitzBuys.length > 0) {
    bitzBuys.sort(function(a, b) { a[4] < b[4] })[0];
    // console.log("lowest buy: " + bitzBuys[0]);
    // console.log("highest buy: " + bitzBuys[bitzBuys.length - 1]);
    highestBitzBuy = bitzBuys[bitzBuys.length - 1][4];
  };

  bittrexSells.sort(function(a, b) { a[4] < b[4] })[0];

  if (bittrexSells.length > 0) {
    lowestBittrexSell = bittrexSells[0][4];
  };

};

bittrex.openBittrex(insert);
bitz.openBitz(insert);

setInterval(function() {
  console.log("buy: " + highestBitzBuy.toString() + " sell: " + lowestBittrexSell.toString() + " spread: " + (highestBitzBuy - lowestBittrexSell).toString());
}, 100);

