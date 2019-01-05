const
  util = require(`util`);

class CoinpaymentsError {
  constructor(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
  }
}

util.inherits(CoinpaymentsError, Error);

module.exports = CoinpaymentsError;