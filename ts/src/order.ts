export class Order {
    ts: Date;
    exchange: string;
    tradingPair: string;
    orderType: string;
    price: number;
    amount: number;
    constructor(ts: Date, exchange: string, tradingPair: string, orderType: string, price: number, amount: number) {
        this.ts = ts;
        this.exchange = exchange;
        this.tradingPair = tradingPair;
        this.orderType = orderType;
        this.price = price;
        this.amount = amount;
    }
}