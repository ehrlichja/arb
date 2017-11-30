import { Order } from "../order";

export abstract class Exchange {
    abstract exchangeName: string
    abstract open(tradingPair: string, handler: (order: Order) => void): void
    abstract buyOrder(price: number, amount: number, tradingPair: string)
    abstract sellOrder(price: number, amount: number, tradingPair: string)
    abstract cancel(orderId: string): boolean
}