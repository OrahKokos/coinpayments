import { prepareNock } from './helpers';
import CoinpaymentsClient from '../../src';

import { CMDS } from '../../src/constants';

describe('Balances e2e test', () => {
  let client;
  const credentials = { key: 'x', secret: 'y' };
  beforeAll(() => {
    client = new CoinpaymentsClient(credentials);
  });
  it('Should catch valid payload - no args', () => {
    const VALID_PAYLOAD = {
      cmd: CMDS.BALANCES,
    };
    const nock = prepareNock(credentials, VALID_PAYLOAD);
    client.balances();
    expect(nock.isDone()).toBeTruthy();
  });
  it('Should catch valid payload - only callback', () => {
    const VALID_PAYLOAD = {
      cmd: CMDS.BALANCES,
    };
    const nock = prepareNock(credentials, VALID_PAYLOAD);
    const mockCallback = jest.fn();
    client.balances(mockCallback);
    expect(mockCallback).toHaveBeenCalled();
    expect(nock.isDone()).toBeTruthy();
  });
  it('Should catch valid payload - args & callback', () => {
    const VALID_PAYLOAD = {
      cmd: CMDS.BALANCES,
      all: 1,
    };
    const nock = prepareNock(credentials, VALID_PAYLOAD);
    const mockCallback = jest.fn();
    client.balances(VALID_PAYLOAD, mockCallback);
    expect(mockCallback).toHaveBeenCalled();
    expect(nock.isDone()).toBeTruthy();
  });
});
