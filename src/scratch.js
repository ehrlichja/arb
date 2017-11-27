const request = require('request');

const bitz = require('./bitz.js');
const coingi = require('./coingi.js');

coingi.sell(200, 'vtc-btc');

//bitz.sell(0.0004, 2)
/*
request.post('http://www.google.com', function(err, res, body) {
  console.log(res);
});
*/
