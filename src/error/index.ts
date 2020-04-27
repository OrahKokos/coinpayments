export default class CoinpaymentsError extends Error {
  public name: string
  public message: string
  public extra: {}

  constructor(message: string, extra: {} = {}) {
    super(message)
    Error.captureStackTrace(this, CoinpaymentsError)
    this.name = this.constructor.name
    this.message = message
    this.extra = extra
  }
}
