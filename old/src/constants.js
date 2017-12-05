var exports = module.exports = {};

exports.ARKBTC = "ARKBTC";
exports.VTCBTC = "VTCBTC";

exports.pair_id = function(pair) {
  if (pair == "ARK-BTC") {
    var pair_id = exports.ARKBTC;
  } else if (pair == "BTC-VTC") {
    var pair_id = exports.VTCBTC;
  } else if (pair == "vtc-btc") {
    var pair_id = exports.VTCBTC;
  } else {
    var pair_id = -1;
  }
  return pair_id;
};
