import {
  prepareHTTPInterceptor,
  mockCredentials,
  generateInvalidPayloadTests,
} from '../helpers';

import CoinpaymentsClient from '../../src';

import { CMDS } from '../../src/constants';

describe('Buy tag e2e test', () => {
  let client: CoinpaymentsClient;
  const VALID_API_PAYLOAD = {
    coin: 'coin',
  };
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials);
  });
  it('Should not throw error on valid payload', async () => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.BUY_TAG,
      ...VALID_API_PAYLOAD,
    };
    const scope = prepareHTTPInterceptor(mockCredentials, VALID_PAYLOAD_MOCK);
    await client.buyTag(VALID_API_PAYLOAD);
    expect(scope.isDone()).toBeTruthy();
  });
  generateInvalidPayloadTests('buyTag', VALID_API_PAYLOAD);
});
