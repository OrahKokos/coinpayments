const https = require(`https`),
  crypto = require(`crypto`),
  qs = require(`querystring`),
  { EventEmitter } = require(`events`);

const CoinpaymentsConfig = require(`./config`),
  CoinpaymentsError = require(`./error`),
  CoinpaymentsUtil = require(`./util`);

const { API_VERSION, API_PROTOCOL, API_HOST, API_PATH } = CoinpaymentsConfig;

class Coinpayments extends EventEmitter {
  constructor({ key = ``, secret = `` }) {
    if (!key) throw new CoinpaymentsError(`Missing public key`);
    if (!secret) throw new CoinpaymentsError(`Missing private key`);
    super();
    this.credentials = { key, secret };

    this.getBasicInfo = this.getBasicInfo.bind(this);
    this.rates = this.rates.bind(this);
    this.balances = this.balances.bind(this);
    this.getDepositAddress = this.getDepositAddress.bind(this);
    this.createTransaction = this.createTransaction.bind(this);
    this.getCallbackAddress = this.getCallbackAddress.bind(this);
    this.getTx = this.getTx.bind(this);
    this.getTxList = this.getTxList.bind(this);
    this.getTxMulti = this.getTxMulti.bind(this);
    this.createTransfer = this.createTransfer.bind(this);
    this.convertCoins = this.convertCoins.bind(this);
    this.convertLimits = this.convertLimits.bind(this);
    this.getWithdrawalHistory = this.getWithdrawalHistory.bind(this);
    this.getWithdrawalInfo = this.getWithdrawalInfo.bind(this);
    this.getConversionInfo = this.getConversionInfo.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.tagList = this.tagList.bind(this);
    this.updateTagProfile = this.updateTagProfile.bind(this);
    this.claimTag = this.claimTag.bind(this);
  }
  _getPrivateHeaders(parameters) {
    const { secret, key } = this.credentials;

    parameters.key = key;

    const paramString = qs.stringify(parameters);
    const signature = crypto
      .createHmac(`sha512`, secret)
      .update(paramString)
      .digest(`hex`);

    return {
      "Content-Type": `application/x-www-form-urlencoded`,
      HMAC: signature
    };
  }
  _getIpnHMAC(merchantSecret = false, payload) {
    if (!merchantSecret) throw new CoinpaymentsError(`Invalid merchant secret`);
    const paramString = qs.stringify(payload).replace(/%20/g, `+`);
    return crypto
      .createHmac(`sha512`, merchantSecret)
      .update(paramString)
      .digest(`hex`);
  }
  verify(hmac = ``, merchantSecret = false, payload) {
    if (!merchantSecret) throw new CoinpaymentsError(`Invalid merchant secret`);
    const calcHash = this._getIpnHMAC(merchantSecret, payload);
    if (hmac !== calcHash) return false;
    return true;
  }
  request(parameters, callback) {
    const assertResult = CoinpaymentsUtil.assertPayload(parameters);
    if (assertResult.isError) {
      if (callback) return callback(assertResult.error);
      return Promise.reject(assertResult.error);
    }
    parameters.version = API_VERSION;

    const options = {
      protocol: API_PROTOCOL,
      method: `post`,
      host: API_HOST,
      path: API_PATH,
      headers: this._getPrivateHeaders(parameters)
    };

    const query = qs.stringify(parameters);

    if (callback) {
      return this.callbackRequest(options, query, callback);
    } else {
      return this.promiseRequest(options, query);
    }
  }
  callbackRequest(options, query, callback) {
    const req = https.request(options, res => {
      let data = ``;

      res.setEncoding(`utf8`);

      res.on(`data`, chunk => {
        data += chunk;
      });

      res.on(`end`, () => {
        try {
          data = JSON.parse(data);
        } catch (e) {
          return callback(new CoinpaymentsError(`Invalid response`, data));
        }
        if (data.error !== `ok`) {
          return callback(new CoinpaymentsError(data.error));
        }
        return callback(null, data.result);
      });
    });
    req.on(`error`, callback);
    req.write(query);
    req.end();
  }
  promiseRequest(options, query) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        let data = ``;

        res.setEncoding(`utf8`);

        res.on(`data`, chunk => {
          data += chunk;
        });

        res.on(`end`, () => {
          try {
            data = JSON.parse(data);
          } catch (e) {
            return reject(new CoinpaymentsError(`Invalid response`, data));
          }

          if (data.error !== `ok`) {
            return reject(new CoinpaymentsError(data.error, data));
          }
          return resolve(data.result);
        });
      });
      req.on(`error`, reject);
      req.write(query);
      req.end();
    });
  }
  createTransaction(options, callback) {
    options = Object.assign({}, options, {
      cmd: `create_transaction`
    });
    return this.request(options, callback);
  }
  rates(options = {}, callback) {
    if (typeof options == `function`) {
      callback = options;
      options = {};
    }
    options = Object.assign({}, options, {
      cmd: `rates`
    });
    return this.request(options, callback);
  }
  balances(options = {}, callback) {
    if (typeof options == `function`) {
      callback = options;
      options = {};
    }
    options = Object.assign({}, options, {
      cmd: `balances`
    });
    return this.request(options, callback);
  }
  createWithdrawal(options, callback) {
    options = Object.assign(
      {
        auto_confirm: 1
      },
      options,
      {
        cmd: `create_withdrawal`
      }
    );
    return this.request(options, callback);
  }
  createMassWithdrawal(withdrawalArray, callback) {
    if (!(withdrawalArray instanceof Array)) {
      return callback(
        new CoinpaymentsError(`Invalid withdrawal array`.withdrawalArray)
      );
    }

    withdrawalArray = withdrawalArray.filter(function(w) {
      return w.currency && w.amount && w.address;
    });

    if (!withdrawalArray.length)
      return callback(
        new CoinpaymentsError(`Invalid withdrawal array`.withdrawalArray)
      );

    const options = {
      cmd: `create_mass_withdrawal`
    };

    withdrawalArray.reduce(function(options, w, index) {
      options[`wd[wd${index + 1}][amount]`] = w.amount;
      options[`wd[wd${index + 1}][address]`] = w.address;
      options[`wd[wd${index + 1}][currency]`] = w.currency;

      if (w.dest_tag) {
        options[`wd[wd${index + 1}][dest_tag]`] = w.dest_tag;
      }
      
      return options;
    }, options);

    return this.request(options, callback);
  }
  getTx(options, callback) {
    options = Object.assign({}, options, {
      cmd: `get_tx_info`
    });
    return this.request(options, callback);
  }
  getWithdrawalInfo(options, callback) {
    options = Object.assign({}, options, {
      cmd: `get_withdrawal_info`
    });
    return this.request(options, callback);
  }
  getTxMulti(tx_id_array = [], callback) {
    const options = {};
    if (!(tx_id_array instanceof Array) || !tx_id_array.length) {
      return callback(new CoinpaymentsError(`Invalid argument`, tx_id_array));
    }
    Object.assign(
      options,
      {
        txid: tx_id_array.join(`|`)
      },
      {
        cmd: `get_tx_info_multi`
      }
    );
    return this.request(options, callback);
  }
  getTxList(options = {}, callback) {
    if (typeof options == `function`) {
      callback = options;
      options = {};
    }
    options = Object.assign({}, options, {
      cmd: `get_tx_ids`
    });
    return this.request(options, callback);
  }
  getBasicInfo(callback) {
    const options = { cmd: `get_basic_info` };
    return this.request(options, callback);
  }
  getDepositAddress(options, callback) {
    options = Object.assign({}, options, { cmd: `get_deposit_address` });
    return this.request(options, callback);
  }
  getCallbackAddress(options, callback) {
    options = Object.assign({}, options, {
      cmd: `get_callback_address`
    });
    return this.request(options, callback);
  }
  createTransfer(options, callback) {
    options = Object.assign(
      {
        auto_confirm: 1
      },
      options,
      {
        cmd: `create_transfer`
      }
    );
    return this.request(options, callback);
  }
  convertCoins(options, callback) {
    options = Object.assign({}, options, {
      cmd: `convert`
    });
    return this.request(options, callback);
  }
  convertLimits(options, callback) {
    options = Object.assign({}, options, {
      cmd: `convert_limits`
    });
    return this.request(options, callback);
  }
  getWithdrawalHistory(options = {}, callback) {
    if (typeof options == `function`) {
      callback = options;
      options = {};
    }
    options = Object.assign({}, options, {
      cmd: `get_withdrawal_history`
    });
    return this.request(options, callback);
  }
  getConversionInfo(options, callback) {
    options = Object.assign({}, options, { cmd: `get_conversion_info` });
    return this.request(options, callback);
  }
  getProfile(options, callback) {
    options = Object.assign({}, options, { cmd: `get_pbn_info` });
    return this.request(options, callback);
  }
  tagList(callback) {
    const options = { cmd: `get_pbn_list` };
    return this.request(options, callback);
  }
  updateTagProfile(options, callback) {
    options = Object.assign({}, options, {
      cmd: `update_pbn_tag`
    });
    return this.request(options, callback);
  }
  claimTag(options, callback) {
    options = Object.assign({}, options, {
      cmd: `claim_pbn_tag`
    });
    return this.request(options, callback);
  }
}

module.exports = Coinpayments;
