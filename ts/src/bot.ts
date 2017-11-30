/* Exchanges */
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';

import { Order } from "./order";
import { setInterval } from 'timers';

import * as lokijs from 'lokijs';

let orders = [];
let db = new lokijs("default");
let a = db.addCollection("analysis");

function analyzer(): void {
  let thisOrders = orders;
  let mapped = thisOrders.map(function(order) {
    return [`${order.tradingPair}-${order.exchange}-${order.orderType}`, 1];
  })
  function reducer(acc, val, i, arr) {
    acc[val[0]] = (acc[val[0]]|0)+1;
    return acc;
  }
  let reduced = mapped.reduce(reducer, { });
  console.log(reduced);
  console.log("------------------------------------------------")
}

function handler(order: Order): void {
  orders.push(order);
  if (orders.length > 200) {
    orders.shift()
  }
}

new Coingi().open("vtc-btc", handler);
new Coingi().open("ltc-btc", handler);
new Bittrex().open("BTC-VTC", handler);
new Bittrex().open("BTC-LTC", handler);

setInterval(
  analyzer,
  1000
);