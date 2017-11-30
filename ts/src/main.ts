/* Deps */
import fs = require("fs");
import mysql = require('mysql');
import config = require('config');

/* Util */
import order = require('./order');
import constants = require('./constants');

/* Exchanges */
import bittrex = require('./exchanges/bittrex')
import cryptopia = require('./exchanges/cryptopia')
import bitz = require('./exchanges/bitz')
import coingi = require('./exchanges/coingi');