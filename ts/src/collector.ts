
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';
import { Order } from "./order";
import { pairId } from "./constants"

function logOrder(order: Order) {
    let csv = [order.ts.getTime(), order.exchange, order.tradingPair, order.price, order.amount].join(",");
    console.log(csv);
}

Object.keys(pairId.COINGI).forEach(function(val, i, arr) {
    new Coingi().open(val, logOrder);
});