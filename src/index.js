'use strict';

const
  https        = require(`https`),
  crypto       = require(`crypto`),
  events       = require(`events`),
  qs           = require(`querystring`),
  eventEmitter = new events.EventEmitter();

const
  ipn = require(`./ipn.js`);

module.exports = (function () {

  const
    API_VERSION = 1,
    API_HOST    = `www.coinpayments.net`,
    API_PATH    = `/api.php`;

  function CoinPayments({ key=false, secret=false, autoIpn=false, ipnTime=30 }){
    if (!key || !secret) {
      throw new Error(`Missing public key and/or secret`);
    }
    this.credentials   = { key, secret };
    this.config        = { autoIpn, ipnTime, isPolling: false };
    this._transactions = [];
    this._withdrawals = [];
    this._conversions = [];
  }

  CoinPayments.prototype = Object.create(eventEmitter);
  CoinPayments.prototype.constructor = CoinPayments;

  CoinPayments.events = eventEmitter;
  CoinPayments.ipn = ipn.bind(eventEmitter);


  CoinPayments.prototype.getSettings = function({cmd=false}) {
    switch(cmd) {
    case `get_basic_info`:
      return [];
    case `get_tx_ids`:
      return [];
    case `get_deposit_address`:
      return [`currency`];
    case `get_callback_address`:
      return [`currency`];
    case `create_transfer`:
      return [`amount`, `currency`, `merchant|pbntag`];
    case `convert`:
      return [`amount`, `from`, `to`];
    case `get_withdrawal_history`:
      return [];
    case `get_conversion_info`:
      return [`id`];
    case `get_pbn_info`:
      return [`pbntag`];
    case `get_pbn_list`:
      return [];
    case `update_pbn_tag`:
      return [`tagid`];
    case `claim_pbn_tag`:
      return [`tagid`, `name`];
    case `get_withdrawal_info`:
      return [`id`];
    case `get_tx_info`:
      return [`txid`];
    case `get_tx_info_multi`:
      return [`txid`];
    case `create_withdrawal`:
      return [`amount`, `currency`, `address`];
    case `create_mass_withdrawal`:
      return [];
    case `create_transaction`:
      return [`amount`, `currency1`, `currency2`];
    case `rates`:
      return [];
    case `balances`:
      return [];
    default:
      return false;
    }
  };

  CoinPayments.prototype._registerTransaction = function ({txn_id}) {
    this._transactions.push(txn_id);
    if (!this.config.isPolling) return this._startPolling();
  };

  CoinPayments.prototype._startPolling = function () {
    if (this.config.isPolling) return;
    const setIntervalAndExecute = (fn) => {
      this.config.isPolling = true;
      fn();
      return setInterval(fn, this.config.ipnTime * 1000);
    };

    const poll = () => {
      if (!this._transactions.length) return this._stopPolling();
      return this.getTxMulti(this._transactions, (err, result) => {
        if (err) return console.warn(`Polling Error...`);
        this.emit(`autoipn`, result);
        for (const tx in result) {
          if (result[tx].status < 0 || result[tx].status == 100 || result[tx].status == 1) {
            this._transactions.splice(this._transactions.indexOf(tx), 1);
          }
        }
        if (!this._transactions.length) return this._stopPolling();
      });
    };

    this.loop = setIntervalAndExecute(poll);
  };

  CoinPayments.prototype._stopPolling = function () {
    this.config.isPolling = false;
    return clearInterval(this.loop);
  };

  CoinPayments.prototype._assert = function(obj, allowArray) {
    let flag = true;
    let msg = `Missing options: `;
    for(let i = 0; i<allowArray.length; i++) {
      let prop = allowArray[i].split(`|`);
      prop = (prop.length == 1) ? prop[0] : prop;
      if (typeof prop == `string`) {
        if(!obj.hasOwnProperty(allowArray[i])) {
          flag = false;
          msg += allowArray[i] + `, `;
        }
      } else {
        flag = false;
        let temp = msg;
        for(let j = 0; j<prop.length; j++) {
          if (obj.hasOwnProperty(prop[j])) {
            flag = true;
          } else {
            temp += prop[j] + `, `;
          }
        }
        msg = (!flag) ? msg : temp;
      }
    }
    return (flag) ? null : msg;
  };

  CoinPayments.prototype._getPrivateHeaders = function (parameters) {
    parameters.key = this.credentials.key;
    
    const paramString = qs.stringify(parameters);
    const signature = crypto.createHmac(`sha512`, this.credentials.secret).update(paramString).digest(`hex`);

    return {
      'Content-Type': `application/x-www-form-urlencoded`,
      'HMAC': signature
    };
  };

  CoinPayments.prototype.request = function(parameters, callback) {

    const reqs = this.getSettings(parameters);
    if(!reqs) return callback(new Error(`No such method ` + parameters.cmd));

    const assert = this._assert(parameters, reqs);
    if(assert) return callback(new Error(assert));
    parameters.version = API_VERSION;

    const options = {
      method: `POST`,
      host: API_HOST,
      path: API_PATH,
      headers: this._getPrivateHeaders(parameters)
    };

    const query = qs.stringify(parameters);
    const req = https.request(options, (res) => {
      let data = ``;

      res.setEncoding(`utf8`);

      res.on(`data`, (chunk) => {
        data += chunk;
      });
      res.on(`end`, () => {
        try {
          data = JSON.parse(data);  
        } catch (e) {
          return callback(e);
        }
        
        if(data.error != `ok`) return callback(data.error);
        if (this.config.autoIpn && parameters.cmd == `create_transaction`) {
          this._registerTransaction(data.result);
        }
        return callback(null, data.result);
      });
    });
    req.on(`error`, callback);
    req.write(query);
    req.end();
  };

  CoinPayments.prototype.createTransaction = function(options, callback) {
    Object.assign(options, {
      cmd: `create_transaction`
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.rates = function(options, callback) {
    if (typeof options == `function`) {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: `rates`
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.balances = function(options, callback) {
    if (typeof options == `function`) {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: `balances`
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.createWithdrawal = function(options, callback) {
    options = Object.assign({
      auto_confirm: 1
    }, options, {
      cmd: `create_withdrawal`
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.createMassWithdrawal = function(withdrawalArray, callback) {
    const options = {
      cmd: `create_mass_withdrawal`
    };
    withdrawalArray = withdrawalArray.filter(function (w) {
      return w.currency && w.amount && w.address;
    });
    if (!withdrawalArray.length)
      return callback(`Invalid withdrawal array`);

    withdrawalArray.reduce(function (options, w, index) {
      options[`wd[wd${index + 1}][amount]`] = w.amount;
      options[`wd[wd${index + 1}][address]`] = w.address;
      options[`wd[wd${index + 1}][currency]`] = w.currency;
    }, options);

    return this.request(options, callback);
  };

  CoinPayments.prototype.getTx = function(txid, callback) {
    const options = { txid, cmd: `get_tx_info` };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getWithdrawalInfo = function(id, callback) {
    const options = { id, cmd: `get_withdrawal_info` };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getTxMulti = function(tx_id_array, callback) {
    const options = { txid: tx_id_array.join(`|`), cmd: `get_tx_info_multi` };
    return this.request(options, callback);
  };
  CoinPayments.prototype.getTxList = function(options, callback) {
    if (typeof options == `function`) {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: `get_tx_ids`
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.getBasicInfo = function(callback) {
    const options = { cmd: `get_basic_info` };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getDepositAddress = function(currency, callback) {
    const options = { currency, cmd: `get_deposit_address` };
    return this.request(options, callback);
  };
  CoinPayments.prototype.getCallbackAddress = function (currency, callback) {
    const options = { currency, cmd: `get_callback_address` };
    return this.request(options, callback);
  };
  CoinPayments.prototype.createTransfer = function (options, callback) {
    options = Object.assign({
      auto_confirm: 1
    }, options, {
      cmd: `create_transfer`
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.convertCoins = function (options, callback) {
    Object.assign(options, {
      cmd: `convert`
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.getWithdrawalHistory = function (options, callback) {
    if (typeof options == `function`) {
      callback = options;
      options = {};
    }
    Object.assign(options, {
      cmd: `get_withdrawal_history`
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.getConversionInfo = function(id, callback) {
    const options = { id, cmd: `get_conversion_info` };
    return this.request(options, callback);
  };

  CoinPayments.prototype.getProfile = function(pbntag, callback) {
    const options = { pbntag, cmd: `get_pbn_info` };
    return this.request(options, callback);
  };

  CoinPayments.prototype.tagList = function(callback) {
    const options = { cmd: `get_pbn_list` };
    return this.request(options, callback);
  };

  CoinPayments.prototype.updateTagProfile = function(options, callback) {
    Object.assign(options, {
      cmd: `update_pbn_tag`
    });
    return this.request(options, callback);
  };

  CoinPayments.prototype.claimTag = function(options, callback) {
    Object.assign(options, {
      cmd: `claim_pbn_tag`
    });
    return this.request(options, callback);
  };

  return CoinPayments;

})();


