/* Exchanges */
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';

import { Order } from "./order";
import { setInterval } from 'timers';

import * as _ from 'underscore'
import * as alasql from 'alasql'

let orders = [];

function analyzer(): void {
  let thisOrders = orders;
  function reducer(acc, order, i, arr) {
    if (acc[order.tradingPair] == undefined) {
      acc[order.tradingPair] = {};
    }
    if (acc[order.tradingPair][order.orderType] == undefined) {
      acc[order.tradingPair][order.orderType] = {};
    }
    if (acc[order.tradingPair][order.orderType][order.exchange] == undefined) {
      acc[order.tradingPair][order.orderType][order.exchange] = [];
    }
    acc[order.tradingPair][order.orderType][order.exchange].push(order.price);
    return acc;
  }
  let reduced = thisOrders.reduce(reducer, {});
  _.mapObject(reduced, function(orderTypes, tradingPair) {
    _.mapObject(orderTypes, function(orders, buyOrSell){
        _.mapObject(orders, function(prices, exchange) {
          let ps = prices.sort()
          let p = buyOrSell == "BUY" ? ps[0] : ps[ps.length - 1];
          // console.log(`${tradingPair} - ${buyOrSell} - ${exchange} - ${p} `)
        })
    })
  })
  let query = `
    SELECT 
    a.tradingPair, 
    a.exchange AS a_ex, 
    b.exchange AS b_ex, 
    a.orderType AS a_o, 
    b.orderType AS b_o, 
    a.price AS a_price, 
    b.price AS b_price,
    a.price - b.price AS profit
    FROM ? a 
    JOIN ? b ON a.exchange != b.exchange 
    AND a.tradingPair = b.tradingPair 
    AND a.orderType != b.orderType
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