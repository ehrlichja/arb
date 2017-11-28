/* Exchanges */
import bittrex = require('./exchanges/bittrex')
import cryptopia = require('./exchanges/cryptopia')
import bitz = require('./exchanges/bitz')
import coingi = require('./exchanges/coingi');

let lowestBittrexSell: number = 0.0;
let highestCoingiBuy: number = 0.0;

export function insertCoingi(data: string) {
  console.log(data);
  return data;
}

console.log(insertCoingi("asd"))