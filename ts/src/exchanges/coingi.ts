import * as promise from "request-promise";
import * as crypto from "crypto";
import * as nonce from "nonce";
import * as config from "config";
import * as request from "request";

import { Exchange } from "./exchange"
import * as constants from "../constants";
import { Order } from "../order";
import { setInterval } from "timers";

export class Coingi extends Exchange {
    sellFee: number
    buyFee: number;
    exchangeName: string = "COINGI";
    buyOrder(price: number, amount: number, tradingPair: string) {
    }
    sellOrder(price: number, amount: number, tradingPair: string) {
        throw new Error("Method not implemented.");
    }
    cancel(orderId: string): boolean {
        throw new Error("Method not implemented.");
    }
    open(tradingPair: string, handler: (order: Order) => void): void {
        let exchangeName = this.exchangeName; // weird...
        console.log(`Coingi REST connected with trading pair ${tradingPair}`);
        let pollMs = 210;
        setInterval(function() {
            let f = function(err, res, body) {
                parser(err, res, body, tradingPair, exchangeName).map(handler);
            }
            request(`https://api.coingi.com/current/order-book/${tradingPair}/200/200/32`, { json: true }, f)
        }, pollMs)
    }
}

function parser(err: object, res: object, body: object, tradingPair: string, exchangeName: string): Order[]  {
    let pairId = constants.pairId[exchangeName][tradingPair];
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
/*
function handler(data) {
    console.log(data);
}

Object.keys(constants.pairId.COINGI).forEach(function(val, i, arr) {
    new Coingi().open(val, handler);
});*/