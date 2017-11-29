"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var constants = require("../constants");
var order_1 = require("../order");
var timers_1 = require("timers");
var exchangeName = "COINGI";
function openCoingi(tradingPair, parser, handler) {
    var pollMs = 210;
    timers_1.setInterval(function () {
        var f = function (err, res, body) {
            parser(err, res, body, tradingPair).map(handler);
        };
        request("https://api.coingi.com/current/order-book/" + tradingPair + "/200/200/32", { json: true }, f);
    }, pollMs);
}
exports.openCoingi = openCoingi;
function parser(err, res, body, tradingPair) {
    var pairId = constants.pairId[tradingPair];
    var orders = [];
    if (body['bids'] != undefined) {
        var buys = body['bids'].map(function (bid) {
            return new order_1.Order(new Date(), exchangeName, pairId, 'BUY', bid['price'], bid['baseAmount']);
        });
        var sells = body['asks'].map(function (bid) {
            return new order_1.Order(new Date(), exchangeName, pairId, 'SELL', bid['price'], bid['baseAmount']);
        });
        orders = sells.concat(buys);
    }
    return orders;
}
exports.parser = parser;
function handler(order) {
    console.log(order);
}
var tradingPair = "vtc-btc";
openCoingi(tradingPair, parser, handler);
