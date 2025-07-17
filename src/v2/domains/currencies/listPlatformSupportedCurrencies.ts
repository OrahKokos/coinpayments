import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { alwaysTrueGuard } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '../../constants'
import { OperationOptions, RequestInput } from '../../types/operations'

import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'listPlatformSupportedCurrencies',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/currencies`
} as const satisfies OperationOptions

export type ListPlatformSupportedCurrenciesOptions = typeof options

export type ListPlatformSupportedCurrenciesHttpOptions = {
  params: never
  queryParams: paths['/v2/currencies']['get']['parameters']['query']
  body: never
  response: paths['/v2/currencies']['get']['responses']['200']['content']['application/json']
}

export type ListPlatformSupportedCurrenciesOperation =
  ListPlatformSupportedCurrenciesOptions &
    ListPlatformSupportedCurrenciesHttpOptions

export const isValidRequestData =
  alwaysTrueGuard<RequestInput<ListPlatformSupportedCurrenciesOperation>>()

export const listPlatformSupportedCurrencies =
  internalCoinpaymentsFlow<ListPlatformSupportedCurrenciesOperation>(options)(
    isValidRequestData
  )(withParams())(withQueryParams('q', 'types', 'capabilities'))(withBody())
