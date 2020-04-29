import CoinpaymentsError from '../../src/error'

describe('Coinpayments Error unit tests', () => {
  it('Should have proper customer error implementation', () => {
    const extra = { prop: 1 }
    const message = 'My custom message'
    const err = new CoinpaymentsError(message, extra)
    expect(err).toBeInstanceOf(Error)
    expect(require('util').isError(err)).toBeTruthy()
    expect(!!err.stack).toBeTruthy()
    expect(err.toString()).toBe(`${err.name}: ${message}`)
    expect(err.stack.split('\n')[0]).toBe(`${err.name}: ${message}`)
    expect(err.extra).toBe(extra)
  })
})
