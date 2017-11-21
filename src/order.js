var exports = module.exports = {};

exports.Order = function(ts, exchange_id, trading_pair_id, order_type, price, amount) {
  this.ts = ts;
  this.exchange_id = exchange_id;
  this.trading_pair_id = trading_pair_id;
  this.order_type = order_type;
  this.price = price;
  this.amount = amount;
};
