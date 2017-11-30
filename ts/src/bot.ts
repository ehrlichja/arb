/* Exchanges */
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';

import { Order } from "./order";

function handler(order: Order): void {
    console.log(order);
}

new Coingi().open("vtc-btc", handler);
new Bittrex().open("BTC-VTC", handler);