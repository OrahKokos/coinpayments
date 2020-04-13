import { prepareNock, mockCredentials } from '../helpers'
import CoinpaymentsClient from '../../src'

import { CMDS } from '../../src/constants'

describe('Internal integration tests', () => {
  let client
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials)
  })
  it('Should trigger callback on invalid validation', done => {
    const INVALID_PAYLOAD = {}
    client.getTx(INVALID_PAYLOAD, err => {
      expect(err).toBeInstanceOf(Error)
      return done()
    })
  })
  it('Should throw proper error on invalid JSON response', async () => {
    const INVALID_JSON = 'not-json'
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.RATES,
    }
    const scope = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK, INVALID_JSON)
    await expect(client.rates()).rejects.toThrow('Invalid response')
    expect(scope.isDone()).toBeTruthy()
  })
  it('Should throw proper error on Coinpayments API error', async () => {
    const API_ERROR = { error: 'not-ok' }
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.RATES,
    }
    const scope = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK, API_ERROR)
    await expect(client.rates()).rejects.toThrow('not-ok')
    expect(scope.isDone()).toBeTruthy()
  })
})
