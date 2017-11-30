import * as bittrexApi from "node-bittrex-api";

import { Order } from "../order";
import * as constants from "../constants"
import { Exchange } from "./exchange";

export class Bittrex extends Exchange {
    exchangeName: string = "BITTREX";
    buyOrder(price: number, amount: number, tradingPair: string) {
        throw new Error("Method not implemented.");
    }
    sellOrder(price: number, amount: number, tradingPair: string) {
        throw new Error("Method not implemented.");
    }
    cancel(orderId: string): boolean {
        throw new Error("Method not implemented.");
    }
    open(tradingPair: string, handler: (order: Order) => void): void {
        let exchangeName = this.exchangeName; // weird...
        bittrexApi.websockets.client(function() {
            console.log(`Bittrex websocket connected with trading pair ${tradingPair}`);
            let f = function(data: object) {
                parser(tradingPair, exchangeName, data).map(handler)
            }
            bittrexApi.websockets.subscribe([tradingPair], f);
        });
    }
}

function parser(tradingPair: string, exchangeName: string, data: object): Order[] {
    let pairId: string = constants.pairId[tradingPair];
    if (data['M'] != undefined && data['M'] == "updateExchangeState") {
        let sells: Order[] = data["A"][0]["Sells"].filter(function(sale: object) {
            return sale["Type"] == "0";
        }).map(function(sale: object) {
            return new Order(new Date(), exchangeName, pairId, 'SELL', sale['Rate'], sale['Quantity']);
        })
        let buys: Order[] = data["A"][0]["Buys"].filter(function(sale: object) {
            return sale["Type"] == "0";
        }).map(function(sale: object) {
            return new Order(new Date(), exchangeName, pairId, 'BUY', sale['Rate'], sale['Quantity']);
        }) 
        return sells.concat(buys);
    } else {
        return [];
    }
}