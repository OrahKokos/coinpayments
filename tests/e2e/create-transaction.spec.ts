import { prepareNock, mockCredentials } from '../helpers'
import CoinpaymentsClient from '../../src'

import { CMDS } from '../../src/constants'

describe('Create transaction e2e test', () => {
  let client
  const VALID_API_PAYLOAD = {
    currency1: 'x',
    currency2: 'y',
    amount: 1,
    buyer_email: 'buyer@email.com',
  }
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials)
  })
  it('Should catch valid payload', async () => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.CREATE_TRANSACTION,
      ...VALID_API_PAYLOAD,
    }
    const scope = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK)
    await client.createTransaction(VALID_API_PAYLOAD)
    expect(scope.isDone()).toBeTruthy()
  })
  it('Should throw error on invalid payload', async () => {
    for (const key in VALID_API_PAYLOAD) {
      const invalidPayloadOverride = { ...VALID_API_PAYLOAD }
      delete invalidPayloadOverride[key]
      await expect(
        client.createTransaction(invalidPayloadOverride)
      ).rejects.toThrow()
    }
  })
})
