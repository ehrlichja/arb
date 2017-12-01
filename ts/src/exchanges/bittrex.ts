import * as bittrexApi from "node-bittrex-api";
import * as config from "config";
import { Order } from "../order";
import * as constants from "../constants"
import { Exchange } from "./exchange";
import { IConfig } from "config";
import { Promise } from "bluebird";

let bittrexConfig: IConfig = config.get("bittrex");

bittrexApi.options({
  'apikey' : bittrexConfig.get('apiKey'),
  'apisecret' : bittrexConfig.get("apiSecret")
});

export class Bittrex extends Exchange {
    sellFee: number;
    buyFee: number;
    exchangeName: string = "BITTREX";
    buyOrder(price: number, amount: number, tradingPair: string, cb: (data: object, err: object) => void) {
        bittrexApi.tradebuy({
            MarketName: tradingPair,
            OrderType: 'LIMIT',
            Quantity: amount,
            Rate: price,
            TimeInEffect: 'GOOD_TIL_CANCELLED', // supported options are 'IMMEDIATE_OR_CANCEL', 'GOOD_TIL_CANCELLED', 'FILL_OR_KILL'
            ConditionType: 'NONE', // supported options are 'NONE', 'GREATER_THAN', 'LESS_THAN'
            Target: 0 // used in conjunction with ConditionType
        }, cb);
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
    let pairId: string = constants.pairId[exchangeName][tradingPair];
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