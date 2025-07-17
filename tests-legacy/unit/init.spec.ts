import { Coinpayments as CoinpaymentsClient } from '../../src'

describe('Init Coinpayments client unit tests', () => {
  it('Should not initilize with missing key', () => {
    let client
    try {
      client = new CoinpaymentsClient({
        key: undefined as unknown as string,
        secret: 'very-secret'
      })
    } catch (e) {
      expect((e as Error).message).toBe('Missing public key')
    }
    expect(client).toBeUndefined()
  })

  it('Should not initilize with missing private key', () => {
    let client
    try {
      client = new CoinpaymentsClient({
        key: 'very-key',
        secret: undefined as unknown as string,
      })
    } catch (e) {
      expect((e as Error).message).toBe('Missing private key')
    }
    expect(client).toBeUndefined()
  })

  it('Should initilize valid payload', () => {
    const client = new CoinpaymentsClient({
      key: 'very-key',
      secret: 'very-secret'
    })
    expect(client).toBeDefined()
  })
})
