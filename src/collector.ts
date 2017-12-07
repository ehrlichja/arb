
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';
import { Order } from "./order";
import { pairId } from "./constants"
import * as request from "request";

function logOrder(order: Order) {
    let csv = [order.ts.getTime(), order.exchange, order.tradingPair, order.orderType, order.price, order.amount].join(",");
    console.log(csv);
}

function postOrder(order: Order) {
    let user = "logstash"
    let pass = "ZhdGeaXNHsHO"
    request.post({url: `http://${user}:${pass}@localhost:9001`, json: order}, function(err, res, body) {
        if (err != undefined) {
            console.log("error posting to logstash")
            console.log(err)
        }
    })
}

Object.keys(pairId.COINGI).forEach(function(val, i, arr) {
    new Coingi().open(val, logOrder);
});

Object.keys(pairId.BITTREX).forEach(function(val, i, arr) {
    new Bittrex().open(val, logOrder);
});