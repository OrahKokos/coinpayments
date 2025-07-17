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
  operationId: 'getConversionsBetweenTwoCurrencies',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/rates`
} as const satisfies OperationOptions

export type GetConversionsBetweenTwoCurrenciesOptions = typeof options

export type GetConversionsBetweenTwoCurrenciesHttpOptions = {
  params: never
  queryParams: paths['/v2/rates']['get']['parameters']['query']
  body: never
  response: paths['/v2/rates']['get']['responses']['200']['content']['application/json']
}

export type GetConversionsBetweenTwoCurrenciesOperation =
  GetConversionsBetweenTwoCurrenciesOptions &
    GetConversionsBetweenTwoCurrenciesHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetConversionsBetweenTwoCurrenciesOperation> => {
  if (!isObject(data)) return false
  if (hasOwn(data, 'from') && isNonEmptyString(data.from)) return false
  if (hasOwn(data, 'to') && isNonEmptyString(data.to)) return false
  return true
}

export const getConversionsBetweenTwoCurrencies =
  internalCoinpaymentsFlow<GetConversionsBetweenTwoCurrenciesOperation>(
    options
  )(isValidRequestData)(withParams())(withQueryParams('from', 'to'))(withBody())
