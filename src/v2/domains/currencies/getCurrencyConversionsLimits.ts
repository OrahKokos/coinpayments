import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { hasOwn, isNonEmptyString, isObject } from '@src/utils/data'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { COINPAYMENTS_API_URL } from '../../constants'

import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'getCurrencyConversionsLimits',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/currencies/limits/{fromCurrency}/{toCurrency}`
} as const satisfies OperationOptions

export type GetCurrencyConversionsLimitsOptions = typeof options

export type GetCurrencyConversionsLimitsHttpOptions = {
  params: paths['/v2/currencies/limits/{fromCurrency}/{toCurrency}']['get']['parameters']['path']
  queryParams: never
  body: never
  response: paths['/v2/currencies/limits/{fromCurrency}/{toCurrency}']['get']['responses']['200']['content']['application/json']
}

export type GetCurrencyConversionsLimitsOperation =
  GetCurrencyConversionsLimitsOptions & GetCurrencyConversionsLimitsHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetCurrencyConversionsLimitsOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'fromCurrency') || !isNonEmptyString(data.fromCurrency))
    return false
  if (!hasOwn(data, 'toCurrency') || !isNonEmptyString(data.toCurrency))
    return false
  return true
}
export const getCurrencyConversionsLimits =
  internalCoinpaymentsFlow<GetCurrencyConversionsLimitsOperation>(options)(
    isValidRequestData
  )(withParams('fromCurrency', 'toCurrency'))(withQueryParams())(withBody())
