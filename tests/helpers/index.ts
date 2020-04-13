import { format } from 'url'
import { stringify } from 'querystring'

import nock from 'nock'

import {
  API_PROTOCOL,
  API_HOST,
  API_PATH,
  API_VALID_RESPONSE,
} from '../constants'

import { applyDefaultOptionValues, getPrivateHeaders } from '../internal'

const mockUrl = format({
  protocol: API_PROTOCOL,
  hostname: API_HOST,
})

export const defaultResponseMock = {
  error: API_VALID_RESPONSE,
  result: true,
}

export const mockCredentials = {
  key: 'mockKey',
  secret: 'mockSecret',
}

export const mockResolveCallback = (scope, done) =>
  jest.fn((error, data) => {
    expect(error).toBe(null)
    expect(data).toBe(true)
    expect(scope.isDone()).toBeTruthy()
    return done()
  })

export const prepareNock = (
  credentials,
  payload,
  responseMock: any = defaultResponseMock
) => {
  const expectedPayload = applyDefaultOptionValues(credentials, payload)
  const reqheaders = getPrivateHeaders(credentials, expectedPayload)

  return nock(mockUrl, { reqheaders })
    .post(API_PATH, stringify(expectedPayload))
    .reply(200, responseMock)
}
