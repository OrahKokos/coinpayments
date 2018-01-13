'use strict';

const
  CoinpaymentsError = require('./error');

module.exports = function () {

  const
    AUTOIPN_STATUS_PENDING    = 'pending',
    AUTOIPN_STATUS_PROCESSING = 'processing',
    AUTOIPN_STATUS_ERROR      = 'error',
    AUTOIPN_STATUS_DONE       = 'done';

  const 
    AUTOIPN_POOL_TRANSACTONS = 'transaction',
    AUTOIPN_POOL_WITHDRAWAL  = 'withdrawal',
    AUTOIPN_POOL_CONVERSION  = 'conversion';

  function AutoIpn () {
    this.isPooling = false;
    this.pollingInProgress = false;
    this.clogged = false;
    this.pool = {};
    this.pool[AUTOIPN_POOL_TRANSACTONS] = [];
    this.pool[AUTOIPN_POOL_WITHDRAWAL] = [];
    this.pool[AUTOIPN_POOL_CONVERSION] = [];
  }

  AutoIpn.prototype = Object.create(this);
  AutoIpn.prototype.constructor = AutoIpn;

  AutoIpn.prototype.register = function (type = false, data) {
    if (!type) return new CoinpaymentsError('AutoIpn Error: No transaction type provided');
    if (!this.pool[type]) return new CoinpaymentsError('AutoIpn Error: Unknown pool type');
    let id;
    if (type === AUTOIPN_POOL_TRANSACTONS) {
      id = data['txn_id'];
    } else {
      id = data['id'];
    }
    this.pool[type].push(Object.assign({
      status: AUTOIPN_STATUS_PENDING,
      id
    }));
    return this._poll();
  };

  AutoIpn.prototype._postProcess = function () {

    let hasFinished = true;

    for (const poolName in this.pool) {
      this.pool[poolName] = this.pool[poolName].filter(element => {
        element.type = poolName;
        this.emit('auto_ipn', element);
        if (
          element.status === AUTOIPN_STATUS_DONE || 
          element.status === AUTOIPN_STATUS_ERROR
        ) return false;
        return true;
      });
      if (this.pool[poolName].length) hasFinished = false;
    }

    if (hasFinished) return this._stopPolling();
  };

  AutoIpn.prototype._executeOpts = function () {
    if (this.pollingInProgress) {
      this.clogged = true;
      return;
    }
    this.pollingInProgress = true;

    let toProcess = 3;

    function done(){
      if (--toProcess) return;
      this._postProcess();
      this.pollingInProgress = false;
    }

    const boundDone = done.bind(this);

    this._loop('transacton', this.getTx.bind(this), [1, -1], boundDone);
    this._loop('withdrawal', this.getWithdrawalInfo.bind(this), [2, -1], boundDone);
    this._loop('conversion', this.getconversionInfo.bind(this), [1, -1], boundDone);
  };

  AutoIpn.prototype._loop = function (poolName, exec, doneAccept, callback) {
    let toProcess = this.poolName[poolName].length;

    function done() {
      if (--toProcess) return;
      return callback();
    }

    for (let i = 0; i < this.poolName[poolName].length; i++) {
      exec(this.poolName[poolName][i].id, function (err, response) {
        if (err) {
          Object.assign(this.poolName[poolName][i], {
            status: AUTOIPN_STATUS_ERROR,
            data: response
          });
          return done();
        }
        Object.assign(this.poolName[poolName][i], {
          status: (doneAccept.includes(response.status)) ? AUTOIPN_STATUS_PROCESSING : AUTOIPN_STATUS_DONE,
          data: response
        });
        return done();
      });
    }
  };

  AutoIpn.prototype._startPolling = function () {
    this.isPooling = true;
    const boundOpts = this._executeOpts.bind(this);
    this.loop = setInterval(boundOpts, this.config.ipnTime * 1000);
    return boundOpts();
  };

  AutoIpn.prototype._stopPolling = function () {
    this.isPooling = false;
    clearInterval(this.loop);
    delete this.loop;
  };

  AutoIpn.prototype._poll = function () {
    if (this.isPooling) return;
    return this._startPolling();
  };

  return AutoIpn();
};