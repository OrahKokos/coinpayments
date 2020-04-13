import { prepareNock, mockCredentials, mockResolveCallback } from '../helpers'
import CoinpaymentsClient from '../../src'

import { CMDS } from '../../src/constants'

describe('Get tag list e2e test', () => {
  let client
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials)
  })
  it('Should catch valid payload', async done => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.GET_TAG_LIST,
    }
    const scope1 = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK)
    await client.tagList()
    expect(scope1.isDone()).toBeTruthy()

    const scope2 = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK)
    await client.tagList(mockResolveCallback(scope2, done))
  })
})
