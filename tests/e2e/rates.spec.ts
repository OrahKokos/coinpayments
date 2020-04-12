import { prepareNock, mockCredentials, mockResolveCallback } from './helpers';
import CoinpaymentsClient from '../../src';

import { CMDS } from '../../src/constants';

describe('Rates e2e test', () => {
  let client;
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials);
  });
  it('Should catch valid payload - no args', async () => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.RATES,
    };
    const scope = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK);
    const { rates } = client;
    await rates();
    expect(scope.isDone()).toBeTruthy();
  });
  it('Should catch valid payload - only callback', done => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.RATES,
    };
    const scope = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK);
    const { rates } = client;
    const mockCallback = mockResolveCallback(scope, done);
    return rates(mockCallback);
  });
  it('Should catch valid payload - args & callback', done => {
    const VALID_API_PAYLOAD = {
      accepted: 1,
      short: 1,
    };
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.RATES,
      ...VALID_API_PAYLOAD,
    };

    const scope = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK);
    const { rates } = client;
    const mockCallback = mockResolveCallback(scope, done);
    return rates(VALID_API_PAYLOAD, mockCallback);
  });
});
