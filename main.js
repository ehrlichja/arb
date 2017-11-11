const request = require('request');
const bittrex = require('node-bittrex-api');
const async = require('async');
const fs = require('fs');

console.log("application started");

/* I/O */

var appendCSV = function(line) {
  fs.appendFile('./spreadData.csv', , function(err) {
    return err;
  });
};

/* Queues for holding streams from the exchanges  */

var bQ = async.queue(function(task, callback) {
  var ask = task;;
  var bid = cBids[cBids.length - 1];
  var spread = bid - ask;
  console.log("Cryptopia Bid: " + bid + " Bittrex Ask: " + ask + " Spread: " + spread);
  appenCSV(bid + ',' + ask + ',' + spread + '\n');
  callback();
});

var cBids = [];

/* Opening connections to exchanges */

var openBittrex = function() {
  bittrex.websockets.client(function() {
    console.log("websocket connected");
    bittrex.websockets.subscribe(['BTC-ARK'], parseBittrexChunk);
  });
};

var openCryptopia = function() {
  
  var cryptopiaRequest = function() {
    request('https://www.cryptopia.co.nz/api/GetMarketOrders/ARK_BTC', { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      cryptopiaSellOrders = body['Data']['Sell'].map(function(order) {
        return order['Price'];
      });
      cBids = [];
      cBids = cryptopiaSellOrders;
      cBids.sort();
    });
  };
  
  setInterval(function() { cryptopiaRequest(); }, 100);

};

/* Parsing data returned from exchanges */

/*
Type 0 – you need to add this entry into your orderbook. There were no orders at matching price before.

Type 1 – you need to delete this entry from your orderbook. This entry no longer exists (no orders at matching price)

Type 2 – you need to edit this entry. There are different number of orders at this price
*/ 

var parseBittrexChunk = function(data) {
  if (data.M == "updateExchangeState") {
    // var sells = data.A[0]['Sells'];
    var buys = data.A[0]['Buys']
    .filter(function(sale) { 
      return sale['Type'] == '0'; 
    }).map(function(sale) {
       var askPrices = sale['Rate'];
       bQ.push(askPrices, function(err) {
       });
    });
  };
};


/* Main */

openCryptopia();
openBittrex();

