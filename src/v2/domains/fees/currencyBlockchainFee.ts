import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { hasOwn, isNonEmptyString, isObject } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'currencyBlockchainFee',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/fees/blockchain/{currency}`
} as const satisfies OperationOptions

export type CurrencyBlockchainFeeOptions = typeof options

export type CurrencyBlockchainFeeHttpOptions = {
  params: paths['/v2/fees/blockchain/{currency}']['get']['parameters']['path']
  queryParams: never
  body: never
  // not defined
  response: {}
}

export type CurrencyBlockchainFeeOperation = CurrencyBlockchainFeeOptions &
  CurrencyBlockchainFeeHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<CurrencyBlockchainFeeOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'currency') || !isNonEmptyString(data.currency))
    return false
  return true
}

export const currencyBlockchainFee =
  internalCoinpaymentsFlow<CurrencyBlockchainFeeOperation>(options)(
    isValidRequestData
  )(withParams('currency'))(withQueryParams())(withBody())
