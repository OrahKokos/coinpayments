import {
  getValidationSchema,
  getVariations,
  validateMassWithDrawal,
} from '../../src/validation'

import { CMDS } from '../../src/constants'

describe('Validation unit tests', () => {
  describe('getVariations tests', () => {
    it('Should return array on no variation', () => {
      const NO_VARIATION = ['prop1', 'prop2', 'prop3']
      const variations = getVariations(NO_VARIATION)
      expect(variations).toBeInstanceOf(Array)
      expect(variations.length).toBe(1)
      expect(variations[0]).toStrictEqual(NO_VARIATION)
      expect(variations).toMatchSnapshot()
    })
    it('Should return array on variation', () => {
      const VARIATION = ['prop1', 'prop2', 'prop3', ['prop4a', 'prop4b']]
      const EXPECTED_VARIATION_1 = ['prop1', 'prop2', 'prop3', 'prop4a']
      const EXPECTED_VARIATION_2 = ['prop1', 'prop2', 'prop3', 'prop4b']
      const variations = getVariations(VARIATION)
      expect(variations).toBeInstanceOf(Array)
      expect(variations.length).toBe(2)
      expect(variations[0]).toBeInstanceOf(Array)
      expect(variations[0]).toStrictEqual(EXPECTED_VARIATION_1)
      expect(variations[1]).toBeInstanceOf(Array)
      expect(variations[1]).toStrictEqual(EXPECTED_VARIATION_2)
      expect(variations).toMatchSnapshot()
    })
  })
  describe('validateMassWithDrawal tests', () => {
    it('Should return false on invalid payload', () => {
      const INVALID_PAYLOAD = {
        cmd: CMDS.CREATE_MASS_WITHDRAWAL,
        'wd[wd1][amount]': 1.0,
        'wd[wd1][address]': '1BitcoinAddress',
        'wd[wd1][currency]': 'BTC',
        'wd[wd2][amount]': 0.0001,
        'wd[wd2][address]': '1BitcoinAddress',
        'wd[wdError][currency]': 'BTC',
        'wd[wd3][amount]': 0.0001,
        'wd[wd3][address]': '1BitcoinAddress',
        'wd[wd3][currency]': 'LTC',
        'wd[wd4][amount]': 0.01,
        'wd[wd4][address]': '1BitcoinAddress',
        'wd[wd4][currency]': 'BTC',
      }
      expect(validateMassWithDrawal(INVALID_PAYLOAD)).toBeFalsy()
    })
    it('Should return true on valid payload', () => {
      const VALID_PAYLOAD = {
        cmd: CMDS.CREATE_MASS_WITHDRAWAL,
        'wd[wd1][amount]': 1.0,
        'wd[wd1][address]': '1BitcoinAddress',
        'wd[wd1][currency]': 'BTC',
        'wd[wd2][amount]': 0.0001,
        'wd[wd2][address]': '1BitcoinAddress',
        'wd[wd2][currency]': 'BTC',
        'wd[wd3][amount]': 0.0001,
        'wd[wd3][address]': '1BitcoinAddress',
        'wd[wd3][currency]': 'LTC',
        'wd[wd4][amount]': 0.01,
        'wd[wd4][address]': '1BitcoinAddress',
        'wd[wd4][currency]': 'BTC',
      }
      expect(validateMassWithDrawal(VALID_PAYLOAD)).toBeTruthy()
    })
  })
  describe('getValidationSchema tests', () => {
    it('Should throw error on undefined', () => {
      let done = 0
      try {
        getValidationSchema(undefined)
      } catch (e) {
        done++
        expect(e.message).toBe('No method passed')
      }
      expect(done).toBeTruthy()
    })
    it('Should throw error on unknown command', () => {
      const UNKNOWN = 'unknown'
      let done = 0
      try {
        getValidationSchema(UNKNOWN)
      } catch (e) {
        done++
        expect(e.message).toBe(`No such method ${UNKNOWN}`)
      }
      expect(done).toBeTruthy()
    })
    it('Should return validation schema', () => {
      Object.keys(CMDS).forEach(cmd => {
        const schema = getValidationSchema(CMDS[cmd])
        expect(schema).toMatchSnapshot()
      })
    })
  })
})
