/* Exchanges */
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';

import { Order } from "./order";
import { setInterval } from 'timers';

import * as alasql from 'alasql'

let orders = [];

function analyzer(): void {
  let thisOrders = orders;
  let query = `
    SELECT 
    a.tradingPair, 
    a.exchange AS a_ex, 
    b.exchange AS b_ex, 
    a.orderType AS a_o, 
    b.orderType AS b_o, 
    a.price AS a_price, 
    b.price AS b_price,
    IF(a.orderType = "BUY", a.price - b.price, b.price - a.price) AS profit
    FROM ? a 
    JOIN ? b 
    ON a.exchange != b.exchange 
    AND a.tradingPair = b.tradingPair 
    AND a.orderType != b.orderType
    WHERE IF(a.orderType = "BUY", a.price - b.price, b.price - a.price) > 0
    ORDER BY profit DESC
    LIMIT 3
  `
  console.log(alasql(query, [thisOrders, thisOrders]));
  console.log("------------------------------------------------");
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