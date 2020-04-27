import {
  prepareHTTPInterceptor,
  mockCredentials,
  generateInvalidPayloadTests,
} from '../helpers'
import CoinpaymentsClient from '../../src'

import { CMDS } from '../../src/constants'

describe('Claim tag e2e test', () => {
  let client
  const VALID_API_PAYLOAD = {
    tagid: 'tagid',
    coin: 'coin',
  }
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials)
  })
  it('Should catch valid payload', async () => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.RENEW_TAG,
      ...VALID_API_PAYLOAD,
    }
    const scope = prepareHTTPInterceptor(mockCredentials, VALID_PAYLOAD_MOCK)
    await client.renewTag(VALID_API_PAYLOAD)
    expect(scope.isDone()).toBeTruthy()
  })
  generateInvalidPayloadTests('renewTag', VALID_API_PAYLOAD)
})
