'use strict';

module.exports = (function () {

  function CoinpaymentsError (message = 'No message passed', extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
  }

  return CoinpaymentsError;
})();