
import { Coingi } from './exchanges/coingi';
import { Bittrex } from './exchanges/bittrex';


function log(err, res, body) {
    console.log(err);
    console.log(body);
}

function cancel(err, res, body) {
    let orderId = body.result;
    console.log(orderId);
    new Coingi().cancel(orderId, log);
    return orderId;
}

// new Bittrex().buyOrder(0.0001, 9, "BTC-BCC", cb);

new Coingi().sellOrder(10000, 1, "btc-vtc", cancel)