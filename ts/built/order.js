"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Order = /** @class */ (function () {
    function Order(ts, exchange, tradingPair, orderType, price, amount) {
        this.ts = ts;
        this.exchange = exchange;
        this.tradingPair = tradingPair;
        this.orderType = orderType;
        this.price = price;
        this.amount = amount;
    }
    return Order;
}());
exports.Order = Order;
