import {
  prepareHTTPInterceptor,
  mockCredentials,
  assertDefaultResponseCallback,
} from '../helpers'
import CoinpaymentsClient from '../../src'

import { CMDS } from '../../src/constants'

describe('Create transaction e2e test', () => {
  let client
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials)
  })
  it('Should catch valid payload', async done => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.GET_BASIC_INFO,
    }
    const scope1 = prepareHTTPInterceptor(mockCredentials, VALID_PAYLOAD_MOCK)
    await client.getBasicInfo()
    expect(scope1.isDone()).toBeTruthy()

    const scope2 = prepareHTTPInterceptor(mockCredentials, VALID_PAYLOAD_MOCK)
    await client.getBasicInfo(assertDefaultResponseCallback(scope2, done))
  })
})
