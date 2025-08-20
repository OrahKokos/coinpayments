import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isArrayOfExactStrings,
  isObject,
  isString,
  optionalPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { Currency } from './types'
import { isValidCapabilities, isValidCurrency } from './util'

export const options = {
  operationId: 'getCurrencies',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/currencies`
} as const satisfies OperationOptions

export type GetCurrenciesOptions = typeof options

export type GetCurrenciesHttpOptions = {
  params: never
  queryParams: {
    q?: string
    types?: Array<'crypto' | 'token' | 'fiat'>
    capabilities?: Array<
      'payments' | 'singleSigAccounts' | 'pooledAccounts' | 'utxo'
    >
  }
  body: never
  response: Array<Currency>
}

export type GetCurrenciesOperation = GetCurrenciesOptions &
  GetCurrenciesHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetCurrenciesOperation> =>
  isObject(input) &&
  optionalPropIs(input, 'q', isString) &&
  optionalPropIs(input, 'types', (value) =>
    isArrayOfExactStrings(value, ['crypto', 'token', 'fiat'])
  ) &&
  optionalPropIs(input, 'capabilities', isValidCapabilities)

export const isValidResponseData = (
  input: unknown
): input is GetCurrenciesHttpOptions['response'] =>
  Array.isArray(input) && input.every(isValidCurrency)

export const getCurrencies = internalCoinpaymentsFlow<GetCurrenciesOperation>(
  options
)(isValidRequestData)(isValidResponseData)(withParams())(
  withQueryParams('q', 'types', 'capabilities')
)(withBody())
