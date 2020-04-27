import { prepareHTTPInterceptor, mockCredentials } from '../helpers'
import CoinpaymentsClient from '../../src'

import { CMDS } from '../../src/constants'

describe('Get deposit address integration test', () => {
  let client
  const VALID_API_PAYLOAD = {
    currency: 'x',
  }
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials)
  })
  it('Should catch valid payload', async () => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.GET_DEPOSIT_ADDRESS,
      ...VALID_API_PAYLOAD,
    }
    const scope = prepareHTTPInterceptor(mockCredentials, VALID_PAYLOAD_MOCK)
    await client.getDepositAddress(VALID_API_PAYLOAD)
    expect(scope.isDone()).toBeTruthy()
  })
  it('Should throw error on invalid payload', async () => {
    for (const key in VALID_API_PAYLOAD) {
      const invalidPayloadOverride = { ...VALID_API_PAYLOAD }
      delete invalidPayloadOverride[key]
      await expect(
        client.getDepositAddress(invalidPayloadOverride)
      ).rejects.toThrow()
    }
  })
})
