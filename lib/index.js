'use strict';

var https = require('https'),
    crypto = require('crypto'),
    events = require('events'),
    qs = require('querystring'),
    eventEmitter = new events.EventEmitter();

var ipn = require('./ipn.js');

module.exports = function () {

  console.warn('Coinpayments version 2.0.0 is here. Please migrate: https://github.com/OrahKokos/coinpayments/issues/24');

  var API_VERSION = 1,
      API_HOST = 'www.coinpayments.net',
      API_PATH = '/api.php';

  function CoinPayments(_ref) {
    var _ref$key = _ref.key,
        key = _ref$key === undefined ? false : _ref$key,
        _ref$secret = _ref.secret,
        secret = _ref$secret === undefined ? false : _ref$secret,
        _ref$autoIpn = _ref.autoIpn,
        autoIpn = _ref$autoIpn === undefined ? false : _ref$autoIpn,
        _ref$ipnTime = _ref.ipnTime,
        ipnTime = _ref$ipnTime === undefined ? 30 : _ref$ipnTime;

    if (!key || !secret) {
      throw new Error('Missing public key and/or secret');
    }
    this.credentials = { key: key, secret: secret };
    this.config = { autoIpn: autoIpn, ipnTime: ipnTime, isPolling: false };
    this._transactions = [];
    this._withdrawals = [];
    this._conversions = [];
  }

  CoinPayments.prototype = Object.create(eventEmitter);
  CoinPayments.prototype.constructor = CoinPayments;

  CoinPayments.events = eventEmitter;
  CoinPayments.ipn = ipn.bind(eventEmitter);

  CoinPayments.prototype.getSettings = function (_ref2) {
    var _ref2$cmd = _ref2.cmd,
        cmd = _ref2$cmd === undefined ? false : _ref2$cmd;

    switch (cmd) {
      case 'get_basic_info':
        return [];
      case 'get_tx_ids':
        return [];
      case 'get_deposit_address':
        return ['currency'];
      case 'get_callback_address':
        return ['currency'];
      case 'create_transfer':
        return ['amount', 'currency', 'merchant|pbntag'];
      case 'convert':
        return ['amount', 'from', 'to'];
      case 'get_withdrawal_history':
        return [];
      case 'get_conversion_info':
        return ['id'];
      case 'get_pbn_info':
        return ['pbntag'];
      case 'get_pbn_list':
        return [];
      case 'update_pbn_tag':
        return ['tagid'];
      case 'claim_pbn_tag':
        return ['tagid', 'name'];
      case 'get_withdrawal_info':
        return ['id'];
      case 'get_tx_info':
        return ['txid'];
      case 'get_tx_info_multi':
        return ['txid'];
      case 'create_withdrawal':
        return ['amount', 'currency', 'address'];
      case 'create_mass_withdrawal':
        return [];
      case 'create_transaction':
        return ['amount', 'currency1', 'currency2'];
      case 'rates':
        return [];
      case 'balances':
        return [];
      default:
        return false;
    }
  };

  CoinPayments.prototype._registerTransaction = function (_ref3) {
    var txn_id = _ref3.txn_id;

    this._transactions.push(txn_id);
    if (!this.config.isPolling) return this._startPolling();
  };

  CoinPayments.prototype._startPolling = function () {
    var _this = this;

    if (this.config.isPolling) return;
    var setIntervalAndExecute = function setIntervalAndExecute(fn) {
      _this.config.isPolling = true;
      fn();
      return setInterval(fn, _this.config.ipnTime * 1000);
    };

    var poll = function poll() {
      if (!_this._transactions.length) return _this._stopPolling();
      return _this.getTxMulti(_this._transactions, function (err, result) {
        if (err) return console.warn('Polling Error...');
        _this.emit('autoipn', result);
        for (var tx in result) {
          if (result[tx].status < 0 || result[tx].status == 100 || result[tx].status == 1) {
            _this._transactions.splice(_this._transactions.indexOf(tx), 1);
          }
        }
        if (!_this._transactions.length) return _this._stopPolling();
      });
    };

    this.loop = setIntervalAndExecute(poll);
  };

  CoinPayments.prototype._stopPolling = function () {
    this.config.isPolling = false;
    return clearInterval(this.loop);
  };

  CoinPayments.prototype._assert = function (obj, allowArray) {
    var flag = true;
    var msg = 'Missing options: ';
    for (var i = 0; i < allowArray.length; i++) {
      var prop = allowArray[i].split('|');
      prop = prop.length == 1 ? prop[0] : prop;
      if (typeof prop == 'string') {
        if (!obj.hasOwnProperty(allowArray[i])) {
          flag = false;
          msg += allowArray[i] + ', ';
        }
      } else {
        flag = false;
        var temp = msg;
        for (var j = 0; j < prop.length; j++) {
          if (obj.hasOwnProperty(prop[j])) {
            flag = true;
          } else {
            temp += prop[j] + ', ';
          }
        }
        msg = !flag ? msg : temp;
      }
    }
    return flag ? null : msg;
  };

  CoinPayments.prototype._getPrivateHeaders = function (parameters) {
    parameters.key = this.credentials.key;

    var paramString = qs.stringify(parameters);
    var signature = crypto.createHmac('sha512', this.credentials.secret).update(paramString).digest('hex');

    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      'HMAC': signature
    };
  };

  CoinPayments.prototype.request = function (parameters, callback) {
    var _this2 = this;

    var reqs = this.getSettings(parameters);
    if (!reqs) return callback(new Error('No such method ' + parameters.cmd));

    var assert = this._assert(parameters, reqs);
    if (assert) return callback(new Error(assert));
    parameters.version = API_VERSION;

    var options = {
      method: 'POST',
      host: API_HOST,
      path: API_PATH,
      headers: this._getPrivateHeaders(parameters)
    };

    var query = qs.stringify(parameters);
    var req = https.request(options, function (res) {
      var data = '';

      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        try {
          data = JSON.parse(data);
        } catch (e) {
          return callback(e);
        }

        if (data.error != 'ok') return callback(data.error);
        if (_this2.config.autoIpn && parameters.cmd == 'create_transaction') {
          _this2._registerTransaction(data.result);
        }
        return callback(null, data.result);
      });
    });
    req.on('error', callback);
    req.write(query);
    req.end();
  };

  CoinPayments.prototype.createTransaction = function (options, callback) {
    Object.assign(options, {
      cmd: 'create_transaction'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.rates = function (options, callback) {
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: 'rates'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.balances = function (options, callback) {
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: 'balances'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.createWithdrawal = function (options, callback) {
    options = Object.assign({
      auto_confirm: 1
    }, options, {
      cmd: 'create_withdrawal'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.createMassWithdrawal = function (withdrawalArray, callback) {
    var options = {
      cmd: 'create_mass_withdrawal'
    };
    withdrawalArray = withdrawalArray.filter(function (w) {
      return w.currency && w.amount && w.address;
    });
    if (!withdrawalArray.length) return callback('Invalid withdrawal array');

    withdrawalArray.reduce(function (options, w, index) {
      options['wd[wd' + (index + 1) + '][amount]'] = w.amount;
      options['wd[wd' + (index + 1) + '][address]'] = w.address;
      options['wd[wd' + (index + 1) + '][currency]'] = w.currency;
      return options;
    }, options);

    return this.request(options, callback);
  };

  CoinPayments.prototype.getTx = function (txid, callback) {
    var options = { txid: txid, cmd: 'get_tx_info' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getWithdrawalInfo = function (id, callback) {
    var options = { id: id, cmd: 'get_withdrawal_info' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getTxMulti = function (tx_id_array, callback) {
    var options = { txid: tx_id_array.join('|'), cmd: 'get_tx_info_multi' };
    return this.request(options, callback);
  };
  CoinPayments.prototype.getTxList = function (options, callback) {
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: 'get_tx_ids'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.getBasicInfo = function (callback) {
    var options = { cmd: 'get_basic_info' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getDepositAddress = function (currency, callback) {
    var options = { currency: currency, cmd: 'get_deposit_address' };
    return this.request(options, callback);
  };
  CoinPayments.prototype.getCallbackAddress = function (currency, callback) {
    var options = { currency: currency, cmd: 'get_callback_address' };
    return this.request(options, callback);
  };
  CoinPayments.prototype.createTransfer = function (options, callback) {
    options = Object.assign({
      auto_confirm: 1
    }, options, {
      cmd: 'create_transfer'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.convertCoins = function (options, callback) {
    Object.assign(options, {
      cmd: 'convert'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.getWithdrawalHistory = function (options, callback) {
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: 'get_withdrawal_history'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.getConversionInfo = function (id, callback) {
    var options = { id: id, cmd: 'get_conversion_info' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getProfile = function (pbntag, callback) {
    var options = { pbntag: pbntag, cmd: 'get_pbn_info' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.tagList = function (callback) {
    var options = { cmd: 'get_pbn_list' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.updateTagProfile = function (options, callback) {
    Object.assign(options, {
      cmd: 'update_pbn_tag'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.claimTag = function (options, callback) {
    Object.assign(options, {
      cmd: 'claim_pbn_tag'
    });
    return this.request(options, callback);
  };

  return CoinPayments;
}();