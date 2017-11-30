import { Order } from "../order";

export abstract class Exchange {
    abstract exchangeName: string
    abstract sellFee: number
    abstract buyFee: number
    abstract open(tradingPair: string, handler: (order: Order) => void): void
    abstract buyOrder(price: number, amount: number, tradingPair: string, cb: (data, err) => void)
    abstract sellOrder(price: number, amount: number, tradingPair: string)
    abstract cancel(orderId: string): boolean
}
