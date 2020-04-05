import { resolveValidation } from '../../src/validation';

import { CMDS } from '../../src/constants';

describe('Validation integration tests', () => {
  describe('resolveValidation tests', () => {
    it('Should return callback error on invalid payload - general', () => {
      const INVALID_PAYLOAD = {
        cmd: CMDS.GET_CONVERSATION_INFO,
      };
      const mockCallback = jest.fn();
      resolveValidation(INVALID_PAYLOAD, mockCallback);
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(mockCallback.mock.calls[0][0].message).toStrictEqual(
        'Missing parameters'
      );
      mockCallback.mockReset();
      resolveValidation(INVALID_PAYLOAD)
        .catch(mockCallback)
        .finally(() => {
          expect(mockCallback).toHaveBeenCalled();
          expect(mockCallback.mock.calls[0][0]).toBeInstanceOf(Error);
          expect(mockCallback.mock.calls[0][0].message).toStrictEqual(
            'Missing parameters'
          );
        });
    });
    it('Should return callback error on invalid payload - mass withdrawal', () => {
      const INVALID_PAYLOAD = {
        cmd: CMDS.CREATE_MASS_WITHDRAWAL,
        'wd[wd1]E[amount]': 1.0,
        'wd[wd1]R[address]': '1BitcoinAddress',
        'wd[wd1]R[currency]': 'BTC',
        'wd[wd2]O[amount]': 0.0001,
        'wd[wd2]R[address]': '1BitcoinAddress',
        'wd[wd2][currency]': 'BTC',
        'wd[wd3][amount]': 0.0001,
        'wd[wd3][address]': '1BitcoinAddress',
        'wd[wd3][currency]': 'LTC',
        'wd[wd4][amount]': 0.01,
        'wd[wd4][address]': '1BitcoinAddress',
        'wd[wd4][currency]': 'BTC',
      };
      const mockCallback = jest.fn();
      resolveValidation(INVALID_PAYLOAD, mockCallback);
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(mockCallback.mock.calls[0][0].message).toStrictEqual(
        'Invalid mass withdrawal payload'
      );
      mockCallback.mockReset();
      resolveValidation(INVALID_PAYLOAD)
        .catch(mockCallback)
        .finally(() => {
          expect(mockCallback).toHaveBeenCalled();
          expect(mockCallback.mock.calls[0][0]).toBeInstanceOf(Error);
          expect(mockCallback.mock.calls[0][0].message).toStrictEqual(
            'Invalid mass withdrawal payload'
          );
        });
    });
  });
});
