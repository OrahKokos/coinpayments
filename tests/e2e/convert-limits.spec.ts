import { prepareHTTPInterceptor, mockCredentials } from '../helpers'
import CoinpaymentsClient from '../../src'

import { CMDS } from '../../src/constants'

describe('Convert limits e2e test', () => {
  let client
  const VALID_API_PAYLOAD = {
    from: 'x',
    to: 'y',
  }
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials)
  })
  it('Should catch valid payload', async () => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.CONVERT_LIMITS,
      ...VALID_API_PAYLOAD,
    }
    const scope = prepareHTTPInterceptor(mockCredentials, VALID_PAYLOAD_MOCK)
    await client.convertLimits(VALID_API_PAYLOAD)
    expect(scope.isDone()).toBeTruthy()
  })
  it('Should throw error on invalid payload', async () => {
    for (const key in VALID_API_PAYLOAD) {
      const invalidPayloadOverride = { ...VALID_API_PAYLOAD }
      delete invalidPayloadOverride[key]
      await expect(
        client.convertLimits(invalidPayloadOverride)
      ).rejects.toThrow()
    }
  })
})
