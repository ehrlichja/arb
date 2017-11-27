/* Deps */
const fs = require('fs');
const mysql = require('mysql');
const config = require('config');

/* Util */
const order = require('./order.js');
const constants = require('./constants.js');

/* Exchanges */
const bittrex = require('./bittrex.js')
const cryptopia = require('./cryptopia.js')
const bitz = require('./bitz.js')
const coingi = require('./coingi.js');

console.log("application started");

/* I/O */

var appendCSV = function(line) {
  fs.appendFile('./spreadData.csv', line, function(err) {
    return err;
  });
};

var dbConfig = config.get('db')
var connection = mysql.createConnection({
  host: dbConfig.get('host'),
  user: dbConfig.get('user'),
  password: dbConfig.get('password'),
  database: dbConfig.get('name')
});

connection.connect();

// takes a list of Order
var insert = function(data) {
  var sql = "INSERT INTO orders (ts, exchange_name, trading_pair, order_type, price, amount) VALUES ?";
  var values = data.filter(function(o) {
    return o.amount != undefined;
  }).map(function(o) {
    var v = [o.ts, o.exchange_id.toString(), o.trading_pair_id.toString(), o.order_type, o.price, o.amount];
    return v;
  });
  connection.query(sql, [values], function(err) {
    if (err) throw err;
  });
};

/* Main */

//cryptopia.openCryptopia(insert, "ARK_BTC");
//bittrex.openBittrex('BTC-VTC', insert);
//bitz.openBitz(insert);
coingi.openCoingi('vtc-btc', insert);
