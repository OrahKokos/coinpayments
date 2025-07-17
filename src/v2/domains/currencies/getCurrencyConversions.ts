import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { alwaysTrueGuard } from '@src/utils/data'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { COINPAYMENTS_API_URL } from '../../constants'

import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'getCurrencyConversions',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/currencies/conversions`
} as const satisfies OperationOptions

export type GetCurrencyConversionsOptions = typeof options

export type GetCurrencyConversionsHttpOptions = {
  params: never
  queryParams: never
  body: never
  response: paths['/v2/currencies/conversions']['get']['responses']['200']['content']['application/json']
}
export type GetCurrencyConversionsOperation = GetCurrencyConversionsOptions &
  GetCurrencyConversionsHttpOptions

const isValidRequestData =
  alwaysTrueGuard<RequestInput<GetCurrencyConversionsOperation>>()

export const getCurrencyConversions =
  internalCoinpaymentsFlow<GetCurrencyConversionsOperation>(options)(
    isValidRequestData
  )(withParams())(withQueryParams())(withBody())
