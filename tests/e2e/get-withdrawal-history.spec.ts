import { prepareNock, mockCredentials, mockResolveCallback } from './helpers';
import CoinpaymentsClient from '../../src';

import { CMDS } from '../../src/constants';

describe('Get withdrawal history e2e test', () => {
  let client;
  beforeAll(() => {
    client = new CoinpaymentsClient(mockCredentials);
  });
  it('Should catch valid payload', async done => {
    const VALID_PAYLOAD_MOCK = {
      cmd: CMDS.GET_WITHDRAWAL_HISTORY,
    };

    const scope1 = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK);
    await client.getWithdrawalHistory();
    expect(scope1.isDone()).toBeTruthy();

    const scope2 = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK);
    await client.getWithdrawalHistory({});
    expect(scope2.isDone()).toBeTruthy();

    const scope3 = prepareNock(mockCredentials, VALID_PAYLOAD_MOCK);
    await client.getWithdrawalHistory(mockResolveCallback(scope3, done));
  });
});
