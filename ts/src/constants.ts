export let ARKBTC = "ARKBTC";
export let VTCBTC = "VTCBTC";
export let LTCBTC = "LTCBTC";
export let PPCBTC = "PPCBTC";
export let DOGEBTC = "DOGEBTC";
export let NMCBTC = "NMCBTC";
export let DASHBTC = "DASHBTC";
export let BCCBTC = "BCCBTC";

enum OrderType {Sell, Buy}

export let pairId = {
  "BITTREX": {
    "BTC-ARK": exports.ARKBTC,
    "BTC-VTC": exports.VTCBTC,
    "BTC-LTC": exports.LTCBTC,
    "BTC-PPC": exports.PPCBTC,
    // "BTC-DOGE": exports.DOGEBTC, // not working
    // "BTC-NMC": exports.NMCBTC, // not working
    "BTC-DASH": exports.DASHBTC,
    "BTC-BCC": exports.BCCBTC
  },
  "COINGI": {
    "vtc-btc": exports.VTCBTC,
    "ltc-btc": exports.LTCBTC,
    "ppc-btc": exports.PPCBTC,
    // "doge-btc": exports.DOGEBTC,
    // "nmc-ntc": exports.NMCBTC,
    "dash-btc": exports.DASHBTC
  }
}