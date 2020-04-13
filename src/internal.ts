import { createHmac } from 'crypto'
import { request as httpsRequest } from 'https'
import { stringify } from 'querystring'

import {
  API_HOST,
  API_PATH,
  API_PROTOCOL,
  API_VERSION,
  API_FORMAT,
  API_VALID_RESPONSE,
} from './constants'
import CoinpaymentsError from './error'
import { validatePayload } from './validation'

import {
  CoinpaymentsCredentials,
  CoinpaymentsRequest,
  CoinpaymentsInternalRequestOps,
  CoinpaymentsInternalResponse,
  CoinpaymentsReturnCallback,
  rejectReturnType,
  resolveReturnType,
} from './types/base'

export const getPrivateHeaders = (
  credentials: CoinpaymentsCredentials,
  options: CoinpaymentsRequest
) => {
  const { secret } = credentials

  const paramString = stringify(options)
  const signature = createHmac('sha512', secret)
    .update(paramString)
    .digest('hex')

  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    HMAC: signature,
  }
}

export const resolveRequest = <ExpectedResponse>(
  reqOps: CoinpaymentsInternalRequestOps,
  options: CoinpaymentsRequest,
  callback?: CoinpaymentsReturnCallback<ExpectedResponse>
) => {
  if (callback) {
    const callbackResolver = resolvedPayload => callback(null, resolvedPayload)

    return makeRequest<ExpectedResponse>(
      reqOps,
      options,
      callbackResolver,
      callback
    )
  }
  return new Promise<ExpectedResponse>((resolve, reject) => {
    return makeRequest<ExpectedResponse>(reqOps, options, resolve, reject)
  })
}

export const makeRequest = <ExpectedResponse>(
  reqOps: CoinpaymentsInternalRequestOps,
  options: CoinpaymentsRequest,
  resolve: resolveReturnType,
  reject: rejectReturnType
): void => {
  const req = httpsRequest(reqOps, res => {
    let chunks = ''

    res.setEncoding('utf8')

    res.on('data', chunk => {
      chunks += chunk
    })

    res.on('end', () => {
      let data: CoinpaymentsInternalResponse<ExpectedResponse> = {
        error: API_VALID_RESPONSE,
      }
      try {
        data = JSON.parse(chunks)
      } catch (e) {
        return reject(new CoinpaymentsError('Invalid response', chunks))
      }

      if (data.error !== API_VALID_RESPONSE) {
        return reject(new CoinpaymentsError(data.error, data))
      }
      return resolve(data.result)
    })
  })
  req.on('error', reject)
  req.write(stringify(options))
  return req.end()
}

export const getRequestOptions = (
  credentials: CoinpaymentsCredentials,
  options: CoinpaymentsRequest
) => {
  return {
    protocol: API_PROTOCOL,
    method: 'post',
    host: API_HOST,
    path: API_PATH,
    headers: getPrivateHeaders(credentials, options),
  }
}

export const applyDefaultOptionValues = (
  credentials: CoinpaymentsCredentials,
  options: CoinpaymentsRequest
): CoinpaymentsRequest => {
  return {
    ...options,
    version: API_VERSION,
    format: API_FORMAT,
    key: credentials.key,
  }
}

export const request = <ExpectedResponse>(
  credentials: CoinpaymentsCredentials,
  options: CoinpaymentsRequest,
  callback?: CoinpaymentsReturnCallback<ExpectedResponse>
): Promise<ExpectedResponse> | void => {
  try {
    validatePayload(options)
  } catch (e) {
    if (callback) {
      return callback(e)
    }
    return Promise.reject(e)
  }
  options = applyDefaultOptionValues(credentials, options)
  const reqOps = getRequestOptions(credentials, options)
  return resolveRequest<ExpectedResponse>(reqOps, options, callback)
}
