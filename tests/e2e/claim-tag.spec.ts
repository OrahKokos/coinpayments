import { prepareNock, mockCredentials } from '../helpers'
import CoinpaymentsClient from '../../src'

import { CMDS } from '../../src/constants'

describe('Claim tag e2e test', () => {
  let client
  const VALID_API_PAYLOAD = {
    tagid: 'tagid',
    name: 'name',
  }
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials)
  })
  it('Should catch valid payload', async () => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.CLAIM_TAG,
      ...VALID_API_PAYLOAD,
    }
    const scope = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK)
    await client.claimTag(VALID_API_PAYLOAD)
    expect(scope.isDone()).toBeTruthy()
  })
  it('Should throw error on invalid payload', async () => {
    for (const key in VALID_API_PAYLOAD) {
      const invalidPayloadOverride = { ...VALID_API_PAYLOAD }
      delete invalidPayloadOverride[key]
      await expect(client.claimTag(invalidPayloadOverride)).rejects.toThrow()
    }
  })
})
