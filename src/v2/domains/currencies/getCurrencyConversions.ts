import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  alwaysTrueGuard,
  isNonEmptyString,
  isObject,
  requiredPropIs
} from '@src/utils/data'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { COINPAYMENTS_API_URL } from '../../constants'

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
  response: Array<{
    from: string
    fromSymbol: string
    to: string
    toSymbol: string
  }>
}
export type GetCurrencyConversionsOperation = GetCurrencyConversionsOptions &
  GetCurrencyConversionsHttpOptions

const isValidRequestData =
  alwaysTrueGuard<RequestInput<GetCurrencyConversionsOperation>>()

export const isValidResponseData = (
  response: unknown
): response is GetCurrencyConversionsHttpOptions['response'] =>
  Array.isArray(response) &&
  response.every(
    (item) =>
      isObject(item) &&
      requiredPropIs(item, 'from', isNonEmptyString) &&
      requiredPropIs(item, 'fromSymbol', isNonEmptyString) &&
      requiredPropIs(item, 'to', isNonEmptyString) &&
      requiredPropIs(item, 'toSymbol', isNonEmptyString)
  )

export const getCurrencyConversions =
  internalCoinpaymentsFlow<GetCurrencyConversionsOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams())(withQueryParams())(withBody())
