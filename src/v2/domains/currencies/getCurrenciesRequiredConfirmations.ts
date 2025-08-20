import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  alwaysTrueGuard,
  isNonEmptyString,
  isNumber,
  isObject,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '../../constants'
import { OperationOptions, RequestInput } from '../../types/operations'

export const options = {
  operationId: 'getCurrenciesRequiredConfirmations',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/currencies/required-confirmations`
} as const satisfies OperationOptions

export type GetRequiredConfirmationsForEachCurrencyOptions = typeof options

export type GetRequiredConfirmationsForEachCurrencyHttpOptions = {
  params: never
  queryParams: never
  body: never
  response: Array<{
    currencyId: string
    currencySymbol: string
    confirmationsCount: number
  }>
}

export type GetRequiredConfirmationsForEachCurrencyOperation =
  GetRequiredConfirmationsForEachCurrencyOptions &
    GetRequiredConfirmationsForEachCurrencyHttpOptions

const isValidRequestData =
  alwaysTrueGuard<
    RequestInput<GetRequiredConfirmationsForEachCurrencyOperation>
  >()

export const isValidResponseData = (
  response: unknown
): response is GetRequiredConfirmationsForEachCurrencyHttpOptions['response'] =>
  Array.isArray(response) &&
  response.every(
    (item) =>
      isObject(item) &&
      requiredPropIs(item, 'currencyId', isNonEmptyString) &&
      requiredPropIs(item, 'currencySymbol', isNonEmptyString) &&
      requiredPropIs(item, 'confirmationsCount', isNumber)
  )

export const getRequiredConfirmationsForEachCurrency =
  internalCoinpaymentsFlow<GetRequiredConfirmationsForEachCurrencyOperation>(
    options
  )(isValidRequestData)(isValidResponseData)(withParams())(withQueryParams())(
    withBody()
  )
