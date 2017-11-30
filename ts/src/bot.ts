/* Exchanges */
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';

import { Order } from "./order";
import { setInterval } from 'timers';

let orders: {} = {};

function join(): void {
  Object.keys(orders).map(function(ts) {
    Object.keys(orders[ts]).map(function(tradingPair) {
      Object.keys(orders[ts][tradingPair]).map(function(exchange) {
        console.log(`${ts} - ${tradingPair} - ${exchange} - ${orders[ts][tradingPair][exchange].length}`)
      })
    });
  });
}

function summary(): void {
  Object.keys(orders).map(function(ts) {
    Object.keys(orders[ts]).map(function(tradingPair) {
      Object.keys(orders[ts][tradingPair]).map(function(exchange) {
        console.log(`${ts} - ${tradingPair} - ${exchange} - ${orders[ts][tradingPair][exchange].length} orders`)
      })
    });
  });
  console.log("------------------------------------------------")
}

function handler(order: Order): void {
  let keys = Object.keys(orders);
  let len = keys.length;
  let ts = order.ts.getTime();
  let tradingPair = order.tradingPair;
  let exchange = order.exchange;
  if (orders[ts] == undefined) {
    orders[ts] = {};
  }
  if (orders[ts][tradingPair] == undefined) {
      orders[ts][tradingPair] = {};
  }
  if (orders[ts][tradingPair][exchange] == undefined) {
    orders[ts][tradingPair][exchange] = [];
  }
  orders[ts][tradingPair][exchange].push(order);
  if (len > 20) {
    delete orders[Object.keys(orders)[0]];
  }
}

new Coingi().open("vtc-btc", handler);
new Coingi().open("ltc-btc", handler);
new Bittrex().open("BTC-VTC", handler);
new Bittrex().open("BTC-LTC", handler);

setInterval(
  summary,
  1000
);