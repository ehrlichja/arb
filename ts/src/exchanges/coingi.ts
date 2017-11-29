import * as promise from "request-promise";
import * as crypto from "crypto";
import * as nonce from "nonce";
import * as config from "config";
import * as request from "request";

import * as constants from "../constants";
import { Order } from "../order";
import { setInterval } from "timers";

let exchangeName: string = "COINGI"

export function openCoingi(tradingPair: string, parser: (err: object, res: object, body: object, tradingPair: string) => Order[], handler: (Order) => void) {
    let pollMs = 210;
    setInterval(function() {
        let f = function(err, res, body) {
            parser(err, res, body, tradingPair).map(handler);
        }
        request(`https://api.coingi.com/current/order-book/${tradingPair}/200/200/32`, { json: true }, f)
    }, pollMs)
}

export function parser(err: object, res: object, body: object, tradingPair: string): Order[]  {
    let pairId = constants.pairId[tradingPair];

    let orders: Order[] = [];
    if (body['bids'] != undefined) {
        let buys = body['bids'].map(function(bid) {
          return new Order(new Date(), exchangeName, pairId, 'BUY', bid['price'], bid['baseAmount']);
        });

        let sells = body['asks'].map(function(bid) {
            return new Order(new Date(), exchangeName, pairId, 'SELL', bid['price'], bid['baseAmount']);
        });
      orders = sells.concat(buys);
    }
    return orders;
}

function handler(order: Order): void {
    console.log(order);
}

let tradingPair = "vtc-btc";
openCoingi(tradingPair, parser, handler)