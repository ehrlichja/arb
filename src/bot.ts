/* Exchanges */
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';
import { Order } from "./order";
import { pairId } from "./constants"
import { setInterval } from 'timers';
import * as alasql from 'alasql'
import { runInThisContext } from 'vm';

let orders = [];

function analyzer(): void {
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
    IF(a.orderType = "SELL", (b.price * MIN(a.amount, b.amount)) - (a.price * MIN(a.amount, b.amount)), (a.price * MIN(a.amount, b.amount)) - (b.price * MIN(a.amount, b.amount))) AS profit
    FROM ? a 
    JOIN ? b 
    ON a.exchange != b.exchange 
    AND a.tradingPair = b.tradingPair 
    AND a.orderType != b.orderType
    ORDER BY profit DESC
    LIMIT 3
  `
  let results = alasql(query, [orders, orders]);
  if (results.length > 0) {
    let opp = results[0];
    console.log(opp);
    // console.log("------------------------------------------------");
    let buyExchange = (opp.a_o == 'SELL') ? opp.a_ex : opp.b_ex;
    let sellExchance = (opp.b_o == 'BUY') ? opp.b_ex : opp.a_ex;
    let buyPrice = (opp.a_o == 'SELL') ? opp.a_price : opp.b_price;
    let sellPrice = (opp.b_o == 'BUY') ? opp.b_price : opp.a_price;
    let amount = Math.min(opp.a_amount, opp.b_amount);
    console.log(`buy ${amount} ${opp.tradingPair} from ${buyExchange} for ${buyPrice} and sell on ${sellExchance} for ${sellPrice}`)
    // place order 1
    // place order 2
    // if 1 isn't filled, cancel 2
  }
}

function tester(): void {
  let query = "SELECT price FROM ? WHERE tradingPair = 'PPCBTC' AND orderType = 'BUY' AND price > 0.0004";
  console.log(alasql(query, [orders]));
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