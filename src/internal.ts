import { createHmac } from 'crypto';
import { request as httpsRequest } from 'https';
import { stringify } from 'querystring';

import {
  API_HOST,
  API_PATH,
  API_PROTOCOL,
  API_VERSION,
  API_FORMAT,
} from './constants';
import CoinpaymentsError from './error';
import { resolveValidation } from './validation';

import {
  CoinpaymentsCredentials,
  CoinpaymentsRequest,
  CoinpaymentsInternalRequestOps,
  CoinpaymentsInternalResponse,
  returnCallback,
  rejectReturnType,
  resolveReturnType,
} from './types/base';

export const getPrivateHeaders = (
  credentials: CoinpaymentsCredentials,
  options: CoinpaymentsRequest
) => {
  const { secret, key } = credentials;

  options.key = key;

  const paramString = stringify(options);
  const signature = createHmac('sha512', secret)
    .update(paramString)
    .digest('hex');

  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    HMAC: signature,
  };
};

export const resolveRequest = <ExpectedResponse>(
  reqOps: CoinpaymentsInternalRequestOps,
  query: string,
  callback?: returnCallback<ExpectedResponse>
) => {
  if (callback) {
    const callbackResolver = resolvedPayload => callback(null, resolvedPayload);

    return makeRequest<ExpectedResponse>(
      reqOps,
      query,
      callbackResolver,
      callback
    );
  }
  return new Promise<ExpectedResponse>((resolve, reject) => {
    return makeRequest<ExpectedResponse>(reqOps, query, resolve, reject);
  });
};

export const makeRequest = <ExpectedResponse>(
  reqOps: CoinpaymentsInternalRequestOps,
  query: string,
  resolve: resolveReturnType,
  reject: rejectReturnType
): void => {
  console.log(reqOps, query);
  const req = httpsRequest(reqOps, res => {
    let chunks = '';
    let data: CoinpaymentsInternalResponse<ExpectedResponse> = {
      error: 'ok',
    };

    res.setEncoding('utf8');

    res.on('data', chunk => {
      chunks += chunk;
    });

    res.on('end', () => {
      try {
        data = JSON.parse(chunks);
      } catch (e) {
        return reject(new CoinpaymentsError('Invalid response', data));
      }

      if (data.error !== 'ok') {
        return reject(new CoinpaymentsError(data.error, data));
      }

      return resolve(data.result);
    });
  });
  req.on('error', reject);
  req.write(query);
  req.end();
};

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
  };
};

export const applyDefaultOptionVales = (
  credentials: CoinpaymentsCredentials,
  options: CoinpaymentsRequest
): CoinpaymentsRequest => {
  return {
    ...options,
    version: API_VERSION,
    format: API_FORMAT,
    key: credentials.key,
  };
};

export const request = <ExpectedResponse>(
  credentials: CoinpaymentsCredentials,
  options: CoinpaymentsRequest,
  callback?: returnCallback<ExpectedResponse>
) => {
  resolveValidation<ExpectedResponse>(options, callback);
  options = applyDefaultOptionVales(credentials, options);
  const reqOps = getRequestOptions(credentials, options);
  const query = stringify(options);
  return resolveRequest<ExpectedResponse>(reqOps, query, callback);
};
