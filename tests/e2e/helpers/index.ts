import { format } from 'url';

import nock from 'nock';

import { API_PROTOCOL, API_HOST, API_PATH } from '../../../src/constants';

import {
  applyDefaultOptionVales,
  getRequestOptions,
} from '../../../src/internal';

const mockUrl = format({
  protocol: API_PROTOCOL,
  hostname: API_HOST,
});

export const prepareNock = (credentials, payload, _forceResponse?) => {
  const expectedPayload = applyDefaultOptionVales(credentials, payload);
  const expectedReqOps = getRequestOptions(credentials, payload);

  console.log('Expected payload', expectedPayload);

  return nock(mockUrl, {
    reqheaders: expectedReqOps.headers,
  })
    .post(API_PATH)
    .query(expectedPayload)
    .reply(200, {
      error: 'ok',
      result: true,
    });
};
