/* Exchanges */
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';

import { Order } from "./order";
import { setInterval } from 'timers';

import * as lokijs from 'lokijs';

let orders: {} = {};
let db = new lokijs("orders");

function analyzer(): void {
  let a = db.addCollection("analysis");
  console.log(orders);
  a.insert(orders);
  /*
  let thisOrders = orders;
  let x = {};
  Object.keys(thisOrders).map(function(ts) {
    Object.keys(thisOrders[ts]).map(function(tradingPair) {
      Object.keys(thisOrders[ts][tradingPair]).map(function(exchange) {
        Object.keys(thisOrders[ts][tradingPair][exchange]).map(function(orderType) {
          if (x[tradingPair] == undefined) {
            x[tradingPair] = {};
          }
          if (x[tradingPair][exchange] == undefined) {
            x[tradingPair][exchange] = [];
          }
          if (x[tradingPair][exchange][orderType] == undefined) {
            x[tradingPair][exchange][orderType] = -1;
          }
          let prices = thisOrders[ts][tradingPair][exchange][orderType].map(function(order) {
            return order.price;
          }).sort()
          let price = -1;
          if (orderType == "SELL") {
            price = prices[0];
          } else {
            price = prices[prices.length - 1];
          }
          x[tradingPair][exchange][orderType] = price;
        });
      })
    });
  });


  function f(a: string, b: string): string { return a; }
  Object.keys(x).map(function(tradingPair) {
    Object.keys(x[tradingPair]).reduce(f);
  });
*/
  let x = a.findOne({ price: { '$gte': 0 } })
  db.removeCollection("analysis");
  console.log(x);
  console.log("------------------------------------------------")
}

function summary(): void {
  Object.keys(orders).map(function(ts) {
    Object.keys(orders[ts]).map(function(tradingPair) {
      Object.keys(orders[ts][tradingPair]).map(function(exchange) {
        Object.keys(orders[ts][tradingPair][exchange]).map(function(orderType) {
          let prices = orders[ts][tradingPair][exchange][orderType].map(function(order){
            return order.price;
          }).sort();
          console.log(`${ts} - ${tradingPair} - ${exchange} - ${orderType} ${orders[ts][tradingPair][exchange][orderType].length} orders - ${prices[0]} -  ${prices[prices.length - 1]}`)
        });
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
  let orderType = order.orderType;
  if (orders[ts] == undefined) {
    orders[ts] = {};
  }
  if (orders[ts][tradingPair] == undefined) {
      orders[ts][tradingPair] = {};
  }
  if (orders[ts][tradingPair][exchange] == undefined) {
    orders[ts][tradingPair][exchange] = {};
  }
  if (orders[ts][tradingPair][exchange][orderType] == undefined) {
    orders[ts][tradingPair][exchange][orderType] = [];
  }
  orders[ts][tradingPair][exchange][orderType].push(order);
  if (len > 20) {
    delete orders[Object.keys(orders)[0]];
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