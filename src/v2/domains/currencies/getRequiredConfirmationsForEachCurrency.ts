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
  operationId: 'getRequiredConfirmationsForEachCurrency',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/currencies/required-confirmations`
} as const satisfies OperationOptions

export type GetRequiredConfirmationsForEachCurrencyOptions = typeof options

export type GetRequiredConfirmationsForEachCurrencyHttpOptions = {
  params: never
  queryParams: never
  body: never
  response: paths['/v2/currencies/required-confirmations']['get']['responses']['200']['content']['application/json']
}

export type GetRequiredConfirmationsForEachCurrencyOperation =
  GetRequiredConfirmationsForEachCurrencyOptions &
    GetRequiredConfirmationsForEachCurrencyHttpOptions

const isValidRequestData =
  alwaysTrueGuard<
    RequestInput<GetRequiredConfirmationsForEachCurrencyOperation>
  >()

export const getRequiredConfirmationsForEachCurrency =
  internalCoinpaymentsFlow<GetRequiredConfirmationsForEachCurrencyOperation>(
    options
  )(isValidRequestData)(withParams())(withQueryParams())(withBody())
