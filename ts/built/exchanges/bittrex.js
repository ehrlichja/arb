"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bittrexApi = require("node-bittrex-api");
var order_1 = require("../order");
var constants = require("../constants");
exports.exchangeName = "BITTREX";
function openBittrex(tradingPair, parser, handler) {
    bittrexApi.websockets.client(function () {
        console.log("Bittrex websocket connected with trading pair " + tradingPair);
        var f = function (data) {
            parser(data).map(handler);
        };
        bittrexApi.websockets.subscribe([tradingPair], f);
    });
}
exports.openBittrex = openBittrex;
function parser(pairId) {
    var pairId = constants.pairId[pairId];
    return function (data) {
        var sells = data["A"][0]["Sells"].filter(function (sale) {
            return sale["Type"] == "0";
        }).map(function (sale) {
            return new order_1.Order(new Date(), exports.exchangeName, pairId, 'SELL', sale['Rate'], sale['Quantity']);
        });
        var buys = data["A"][0]["Buys"].filter(function (sale) {
            return sale["Type"] == "0";
        }).map(function (sale) {
            return new order_1.Order(new Date(), exports.exchangeName, pairId, 'BUY', sale['Rate'], sale['Quantity']);
        });
        return sells.concat(buys);
    };
}
exports.parser = parser;
function handler(order) {
    console.log(order);
}
var tradingPair = "BTC-VTC";
openBittrex(tradingPair, parser(tradingPair), handler);
