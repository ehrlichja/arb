/* Exchanges */
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';
import { Order } from "./order";
import { pairId } from "./constants"
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
    a.amount AS a_amount,
    b.amount AS b_amount,
    ABS(a.price - b.price) AS abs_price_diff,
    a.price * a.amount AS a_cost,
    b.price * b.amount AS b_cost,
    IF(a.orderType = "SELL", (a.price * MIN(a.amount, b.amount)) - (b.price * MIN(a.amount, b.amount)), (b.price * MIN(a.amount, b.amount)) - (a.price * MIN(a.amount, b.amount))) AS profit
    FROM ? a 
    JOIN ? b 
    ON a.exchange != b.exchange 
    AND a.tradingPair = b.tradingPair 
    AND a.orderType != b.orderType
    ORDER BY profit DESC
    LIMIT 3
  `
  console.log(alasql(query, [thisOrders, thisOrders]));
  console.log("------------------------------------------------");
}

function handler(order: Order): void {
  orders.push(order);
  if (orders.length > 2000) {
    orders.shift()
  }
}

Object.keys(pairId.BITTREX).forEach(function(val, i, arr) {
    new Bittrex().open(val, handler);
});

Object.keys(pairId.COINGI).forEach(function(val, i, arr) {
    new Coingi().open(val, handler);
});

setInterval(
  analyzer,
  2000
);