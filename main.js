const request = require('request');
const bittrex = require('node-bittrex-api');
const async = require('async');
const fs = require('fs');

console.log("application started");

/* Accounting */

/*
var bittrexBtcBalance = 1.0;
var bittrexArkBalance = 0;
var cryptopiaBtcBalance = 1.0;
var cryptopiaArkBalance = 0;

var profit = 0; // ???

var bBuy = function(btcPrice, arkUnits) {
  var success = true;
  if (success) {
    bittrexBtcBalance = bittrexBtcBalance - (btcPrice * arkUnits);
    bittrexArkBalance = bittrexArkBalance + arkUnits;
  }
};

var cSell = function(btcPrice, arkUnits) {
  var success = true;
  if (success) {
    cryptopiaBtcBalance = cryptopiaBtcBalance + (btcPrice * arkUnits);
    cryptopiaArkBalance = cryptopiaArkBalance - arkUnits;
  };
};

var maybeTrade = function(bid, ask, spread, arkUnits) {
  if (spread > 0.003) {
    console.log('Bidding on ' + arkUnits + ' of Ark at  ' + ask);
    bBuy(ask, arkUnits);
    console.log('Asking for ' + arkUnits + ' of Ark at  ' + bid);
    cSell(bid, arkUnits);
  }
}
*/

/* I/O */

var appendCSV = function(line) {
  fs.appendFile('./spreadData.csv', line, function(err) {
    return err;
  });
};

/* Queues for holding streams from the exchanges  */

var bittrexBuys = [];
var bittrexSells = [];

var cryBuys = [];
var crySells = [];

// Bid = buy order; Sell = ask order;
/*var bQ = async.queue(function(task, callback) {
  var ask = task;
  var bid = cBids[cBids.length - 1];
  var spread = ask - bid;
  console.log("Cryptopia Bid: " + bid + " Bittrex Ask: " + ask + " Spread: " + spread);
  // appendCSV(bid + ',' + ask + ',' + spread + '\n');
  callback();
});
*/

var cBids = [];

/* Opening connections to exchanges */

var openBittrex = function() {
  bittrex.websockets.client(function() {
    console.log("websocket connected");
    bittrex.websockets.subscribe(['BTC-ARK'], parseBittrexChunk);
  });
};

var openCryptopia = function() {
  
  var pollIntervalMs = 100;

  setInterval(function() { 
    request('https://www.cryptopia.co.nz/api/GetMarketOrders/ARK_BTC', { json: true }, parseCryptopiaChunk);
  }, pollIntervalMs);

};

/* Parsing data returned from exchanges */

var parseCryptopiaChunk = function(err, res, body) {
  if (err) { return console.log(err); }

  var buys = body['Data']['Buy'].map(function(order) {
    return order['Price'];
  });

  var sells = body['Data']['Sell'].map(function(order) {
    return order['Price'];
  });

  cryBuys.shift(buys.length);
  cryBuys.push(buys);
  
  crySells.shift(sells.length);
  crySells.push(sells);
  
  var exchangeId = 2
  var time = new Date().getTime()

  buys.map(function(buy) {
    appendCSV([exchangeId, time, 'BUY', buy + '\n'].join(','))
  });

  sells.map(function(sell) {
    appendCSV([exchangeId, time, 'SELL', sell + '\n'].join(','))
  });

};

/*
Type 0 – you need to add this entry into your orderbook. There were no orders at matching price before.
Type 1 – you need to delete this entry from your orderbook. This entry no longer exists (no orders at matching price)
Type 2 – you need to edit this entry. There are different number of orders at this price
*/ 
var parseBittrexChunk = function(data) {
  if (data.M == "updateExchangeState") {

    var sells = data.A[0]['Sells']
    .filter(function(sale) { 
      return sale['Type'] == '0'; 
    }).map(function(sale) {
      return sale['Rate'];
    });

    var buys = data.A[0]['Buys']
    .filter(function(buy) { 
      return buy['Type'] == '0'; 
    }).map(function(sale) {
      return buy['Rate'];
    });

    bittrexSells.shift(sells.length);
    bittrexSells.push(sells);

    bittrexBuys.shift(buys.length); 
    bittrexBuys.push(sells);

    var exchangeId = 1
    var time = new Date().getTime()

    sells.map(function(sell) {
      appendCSV([exchangeId, time, 'BUY', sell + '\n'].join(','))
    });

    buys.map(function(buy) {
      appendCSV([exchangeId, time, 'SELL', buy + '\n'].join(','))
    });

  };
};


/* Main */

openCryptopia();
openBittrex();

