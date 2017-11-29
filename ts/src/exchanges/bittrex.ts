import * as bittrexApi from "node-bittrex-api";

import { Order } from "../order";
import * as constants from "../constants"

export let exchangeName: string = "BITTREX";

export function openBittrex(tradingPair: string, parser: (object) => Order[], handler: (Order) => void) {
    bittrexApi.websockets.client(function() {
        console.log(`Bittrex websocket connected with trading pair ${tradingPair}`);
        let f = function(data: object) {
            parser(data).map(handler)
        }
        bittrexApi.websockets.subscribe([tradingPair], f);
    });
}

export function parser(pairId: string): (object) => Order[] {
    var pairId: string = constants.pairId[pairId];
    return function(data: object): Order[] {
        let sells = data["A"][0]["Sells"].filter(function(sale: object) {
            return sale["Type"] == "0";
        }).map(function(sale: object) {
            return new Order(new Date(), exchangeName, pairId, 'SELL', sale['Rate'], sale['Quantity']);
        })
        let buys = data["A"][0]["Buys"].filter(function(sale: object) {
            return sale["Type"] == "0";
        }).map(function(sale: object) {
            return new Order(new Date(), exchangeName, pairId, 'BUY', sale['Rate'], sale['Quantity']);
        }) 
        return sells.concat(buys);
    }
}

function handler(order: Order): void {
    console.log(order);
}

let tradingPair: string = "BTC-VTC"
openBittrex(tradingPair, parser(tradingPair), handler);