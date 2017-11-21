/* Deps */
const fs = require('fs');
const mysql = require('mysql');

/* Util */
const order = require('./order.js');

/* Exchanges */
const bittrex = require('./bittrex.js')
const cryptopia = require('./cryptopia.js')
const bitz = require('./bitz.js')

console.log("application started");

/* I/O */

var appendCSV = function(line) {
  fs.appendFile('./spreadData.csv', line, function(err) {
    return err;
  });
};

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'arb',
  password: 'arb',
  database: 'arb',
  debug: true
});

connection.connect();

// takes a list of Order
var insert = function(data) {
  var sql = "INSERT INTO orders (ts, exchange_id, trading_pair_id, order_type, price, amount) VALUES ?";
  var values = data.filter(function(o) {
    return o.amount != undefined;
  }).map(function(o) {
    var v = [o.ts, o.exchange_id.toString(), o.trading_pair_id.toString(), o.order_type, o.price, o.amount];
    console.log(v);
    return v;
  });
  connection.query(sql, [values], function(err) {
    if (err) throw err;
  });
};

/* Main */

cryptopia.openCryptopia(insert);
bittrex.openBittrex(insert);
bitz.openBitz(insert);
