import { isBoolean, isNumber, isObject, isString } from '@src/utils/data'
import { isArrayOfExactStrings, requiredPropIs } from '@src/utils/data'
import { Currency } from './types'

export const isValidType = (input: unknown): input is Currency['type'] => {
  return isString(input) && ['crypto', 'token', 'fiat'].includes(input)
}

export const isValidStatus = (input: unknown): input is Currency['status'] => {
  return (
    isString(input) && ['active', 'underMaintenance', 'deleted'].includes(input)
  )
}

export const isValidLogo = (input: unknown): input is Currency['logo'] => {
  return (
    isObject(input) &&
    requiredPropIs(input, 'imageUrl', isString) &&
    requiredPropIs(input, 'vectorUrl', isString)
  )
}

export const isValidCapabilities = (
  input: unknown
): input is Currency['capabilities'] =>
  isArrayOfExactStrings(input, [
    'payments',
    'singleSigAccounts',
    'pooledAccounts',
    'utxo'
  ])

export const isValidUrls = (input: unknown): input is Currency['urls'] =>
  isObject(input) &&
  requiredPropIs(input, 'website', isString) &&
  requiredPropIs(input, 'explorer', isString)

export const isValidCurrency = (input: unknown): input is Currency =>
  isObject(input) &&
  requiredPropIs(input, 'id', isString) &&
  requiredPropIs(input, 'type', isValidType) &&
  requiredPropIs(input, 'symbol', isString) &&
  requiredPropIs(input, 'name', isString) &&
  requiredPropIs(input, 'logo', isValidLogo) &&
  requiredPropIs(input, 'decimalPlaces', isNumber) &&
  requiredPropIs(input, 'rank', isNumber) &&
  requiredPropIs(input, 'status', isValidStatus) &&
  requiredPropIs(input, 'capabilities', isValidCapabilities) &&
  requiredPropIs(input, 'urls', isValidUrls) &&
  requiredPropIs(input, 'requiredConfirmations', isNumber) &&
  requiredPropIs(input, 'isEnabledForPayment', isBoolean)
