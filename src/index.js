'use strict';

const
  https        = require('https'),
  crypto       = require('crypto'),
  events       = require('events'),
  qs           = require('querystring'),
  eventEmitter = new events.EventEmitter();

const
  ipn               = require('./ipn.js'),
  AutoIpn           = require('./auto-ipn'),
  CoinPaymentsConfig = require('./config.js'),
  CoinPaymentsError = require('./error');

module.exports = (function () {

  const
    API_VERSION = 1,
    API_HOST    = 'www.coinpayments.net',
    API_PATH    = '/api.php';

  function CoinPayments({key=false, secret=false, autoIpn=false, ipnTime=30}){
    if (!key || !secret) {
      throw CoinPaymentsError('CoinPayments Error: Missing public key and/or secret');
    }
    this.AutoIpn = AutoIpn.call(this);

    this.credentials   = { key, secret };
    this.config        = { autoIpn, ipnTime };
  }

  CoinPayments.prototype = Object.create(eventEmitter);
  CoinPayments.prototype.constructor = CoinPayments;

  CoinPayments.events = eventEmitter;
  CoinPayments.ipn = ipn.bind(eventEmitter);

  CoinPayments.prototype._registerError = function (error) {
    return this.emit('error', error);
  };

  CoinPayments.prototype.getRules = function({cmd=false}) {
    if (!cmd || !CoinPaymentsConfig[cmd]) return new CoinPaymentsError('Invalid command', cmd);
    return CoinPaymentsConfig[cmd];
  };

  CoinPayments.prototype.validate = function (data, rules, errMsg = 'Validation error: ') {

    function hasOne (data, rule, errMsg) {
      return (data[rule]) ? true : false;
      errMsg += `${rule}`;
    }

    function oneOf (data, rules, errMsg) {
      for (let i = 0; i < rules.length; i++) {
        if (data[rules[i]]) return true;
      }
      errMsg += `${rules.join(' or ')}`;
      return false;
    }

    let hasError = false;

    for (let i = 0; i < rules.length; i++) {
      if (Array.isArray(rules[i])) {
        hasError = !oneOf(data, rules[i], errMsg);
      } else {
        hasError = !hasOne(data, rules[i], errMsg);
      }
      if (hasError) {
        errMsg += ' is missing';
        return new CoinPaymentsError(errMsg);
      }
    }
    return true;
  };

  CoinPayments.prototype._getPrivateHeaders = function (parameters) {
    parameters.key = this.credentials.key;

    const paramString = qs.stringify(parameters);
    const signature = crypto.createHmac('sha512', this.credentials.secret).update(paramString).digest('hex');

    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      'HMAC': signature
    };
  };

  CoinPayments.prototype.request = function(payloadData, callback) {

    const rules = this.getRules(payloadData);
    if(rules instanceof CoinPaymentsError)
      return callback(rules);

    const assert = this.validate(payloadData, reqs);
    if(assert instanceof CoinPaymentsError)
      return callback(assert);

    payloadData.version = API_VERSION;

    const options = {
      method: 'POST',
      host: API_HOST,
      path: API_PATH,
      headers: this._getPrivateHeaders(payloadData)
    };

    const query = qs.stringify(payloadData);
    const req = https.request(options, (res) => {
      let data = '';

      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          data = JSON.parse(data);  
        } catch(ex) {
          return callback(new CoinPaymentsError('Could not parse response', ex));
        }
        if(data.error != 'ok') 
          return callback(new CoinPaymentsError('Response error', data));

        let autoResponse;
        if (this.config.autoIpn && parameters.cmd == 'create_transaction') {
          if (parameters.cmd === 'create_transaction') 
            autoResponse = this.AutoIpn.register('transaction', data.result);
          if (parameters.cmd === 'create_withdrawal') 
            autoResponse = this.AutoIpn.register('withdrawal', data.result);
          if (parameters.cmd === 'convert') 
            autoResponse = this.AutoIpn.register('conversion', data.result);
        }
        if (autoResponse instanceof CoinPaymentsError) this.emit('error', autoResponse);
        return callback(null, data.result);
      });
    });

    req.on('error', callback);
    req.write(query);
    req.end();
  };

  CoinPayments.prototype.createTransaction = function(options, callback) {
    Object.assign(options, {
      cmd: 'create_transaction'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.rates = function(options, callback) {
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: 'rates'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.balances = function(options, callback) {
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: 'balances'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.createWithdrawal = function(options, callback) {
    options = Object.assing({
      auto_confirm: 1
    }, options, {
      cmd: 'create_withdrawal'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.createMassWithdrawal = function(withdrawalArray, callback) {
    const options = {
      cmd: 'create_mass_withdrawal'
    };
    withdrawalArray = withdrawalArray.filter(function (w) {
      return w.currency && w.amount && w.address;
    });
    if (!withdrawalArray.length) 
      return callback(new CoinPaymentsError('Invalid withdrawal array'));
    
    withdrawalArray.reduce(function (options, w, index) {
      options[`wd[wd${index + 1}][amount]`] = w.amount;
      options[`wd[wd${index + 1}][address]`] = w.address;
      options[`wd[wd${index + 1}][currency]`] = w.currency;
    }, options);
    
    return this.request(options, callback);
  };

  CoinPayments.prototype.getTx = function(txid, callback) {
    const options = { txid, cmd: 'get_tx_info' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getWithdrawalInfo = function(id, callback) {
    const options = { id, cmd: 'get_withdrawal_info' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getTxMulti = function(tx_id_array, callback) {
    const options = { txid: tx_id_array.join('|'), cmd: 'get_tx_info_multi' };
    return this.request(options, callback);
  };
  CoinPayments.prototype.getTxList = function(options, callback) {
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: 'get_tx_ids'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.getBasicInfo = function(callback) {
    const options = { cmd: 'get_basic_info' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getDepositAddress = function(currency, callback) {
    const options = { currency, cmd: 'get_deposit_address' };
    return this.request(options, callback);
  };
  CoinPayments.prototype.getCallbackAddress = function (currency, callback) {
    const options = { currency, cmd: 'get_callback_address' };
    return this.request(options, callback);
  };
  CoinPayments.prototype.createTransfer = function (options, callback) {
    options = Object.assing({
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

  CoinPayments.prototype.getConversionInfo = function(id, callback) {
    const options = { id, cmd: 'get_conversion_info' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getProfile = function(pbntag, callback) {
    const options = { pbntag, cmd: 'get_pbn_info' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.tagList = function(callback) {
    const options = { cmd: 'get_pbn_list' };
    return this.request(options, callback);
  };

  CoinPayments.prototype.updateTagProfile = function(options, callback) {
    Object.assign(options, {
      cmd: 'update_pbn_tag'
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.claimTag = function(options, callback) {
    Object.assign(options, {
      cmd: 'claim_pbn_tag'
    });
    return this.request(options, callback);
  };

  return CoinPayments;

})();


