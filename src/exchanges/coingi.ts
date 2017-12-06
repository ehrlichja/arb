import * as crypto from "crypto";
import * as nonce from "nonce";
import * as config from "config";
import * as request from "request";

import { Exchange } from "./exchange"
import * as constants from "../constants";
import { Order } from "../order";
import { setInterval } from "timers";
import { pairId } from "../constants";

let pollMs = 500;

export class Coingi extends Exchange {
    sellFee: number
    buyFee: number;
    exchangeName: string = "COINGI";
    buyOrder(price: number, amount: number, tradingPair: string, cb: (err, res, body) => void) {
        order(0, price, amount, tradingPair, cb);
    }
    sellOrder(price: number, amount: number, tradingPair: string, cb: (err, res, body) => void) {
        order(1, price, amount, tradingPair, cb);
    }
    cancel(orderId: string, cb: (err, res, body) => any) {
        let form = {
            orderId: orderId
        }
        let signedForm = sign(form);
        request.post({url: 'https://api.coingi.com/user/cancel-order', json: signedForm}, cb);
    }
    open(tradingPair: string, handler: (order: Order) => void): void {
        let exchangeName = this.exchangeName; // weird...
        setInterval(function() {
            let f = function(err, res, body) {
                parser(err, res, body, tradingPair, exchangeName).map(handler);
            }
            request(`https://api.coingi.com/current/order-book/${tradingPair}/200/200/32`, { json: true }, f)
        }, pollMs)
    }
}

function order(type: number, price: number, amount: number, tradingPair: string, cb: (res: object, data: object, err: object) => void) {
    let form = {
        id: "test-123",
        type: type, // 0 = bid, 1 = ask
        timestamp: Math.round(new Date().getTime() / 1000),
        currencyPair: tradingPair,
        price: price,
        volume: amount
    };
    let signedForm = sign(form)
    request.post({url: `https://api.coingi.com/user/add-order`, json:signedForm}, cb)
}

function sign(form: object) {
    let coingiConfig: string = config.get("coingi");
    let apiKey: string = config.get("apiKey");
    let apiSecret: string = config.get("secretKey");
    let nonce = Math.floor(Math.random()*8999999999999999999+1000000000000000000);
    let hmac = crypto.createHmac('sha256', apiSecret);
    hmac.update(nonce + "$" + apiKey);
    let sig = hmac.digest("hex")
    form['token'] = apiKey;
    form['nonce'] = nonce;
    form['signature'] = sig;
    return form;
}

function parser(err: object, res: object, body: object, tradingPair: string, exchangeName: string): Order[]  {
    let pairId = constants.pairId[exchangeName][tradingPair];
    let orders: Order[] = [];
    if (body != undefined && body['bids'] != undefined) {
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