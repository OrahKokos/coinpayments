import { prepareNock, mockCredentials } from '../helpers'
import CoinpaymentsClient from '../../src'

import { CMDS } from '../../src/constants'

describe('Create mass withdrawal e2e test', () => {
  let client
  const VALID_API_PAYLOAD_1 = {
    currency: 'x',
    amount: 1,
    address: 'address',
  }
  const VALID_API_PAYLOAD_2 = {
    currency: 'x',
    amount: 1,
    pbntag: 'pbntag',
    auto_confirm: false,
  }
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials)
  })
  it('Should catch valid payload', async () => {
    const VALID_PAYLOAD_MOCK_1 = {
      cmd: CMDS.CREATE_WITHDRAWAL,
      auto_confirm: true,
      ...VALID_API_PAYLOAD_1,
    }
    const VALID_PAYLOAD_MOCK_2 = {
      cmd: CMDS.CREATE_WITHDRAWAL,
      auto_confirm: false,
      ...VALID_API_PAYLOAD_2,
    }
    const scope1 = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK_1)
    await client.createWithdrawal(VALID_API_PAYLOAD_1)
    expect(scope1.isDone()).toBeTruthy()

    const scope2 = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK_2)
    await client.createWithdrawal(VALID_API_PAYLOAD_2)
    expect(scope2.isDone()).toBeTruthy()
  })
  it('Should throw error on invalid payload', async () => {
    for (const key in VALID_API_PAYLOAD_1) {
      const invalidPayloadOverride = { ...VALID_API_PAYLOAD_1 }
      delete invalidPayloadOverride[key]
      await expect(
        client.createWithdrawal(invalidPayloadOverride)
      ).rejects.toThrow()
    }
    await expect(
      client.createWithdrawal({
        ...VALID_API_PAYLOAD_1,
        ...VALID_API_PAYLOAD_2,
      })
    ).rejects.toThrow()
  })
})
