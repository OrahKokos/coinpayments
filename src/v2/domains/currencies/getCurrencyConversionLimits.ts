import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isNonEmptyString,
  isNumber,
  isObject,
  requiredPropIs
} from '@src/utils/data'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { COINPAYMENTS_API_URL } from '../../constants'

export const options = {
  operationId: 'getCurrencyConversionLimits',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/currencies/limits/{from}/{to}`
} as const satisfies OperationOptions

export type GetCurrencyConversionsLimitsOptions = typeof options

export type GetCurrencyConversionsLimitsHttpOptions = {
  params: {
    from: string
    to: string
  }
  queryParams: never
  body: never
  response: {
    min: number
    max: number
  }
}

export type GetCurrencyConversionsLimitsOperation =
  GetCurrencyConversionsLimitsOptions & GetCurrencyConversionsLimitsHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetCurrencyConversionsLimitsOperation> =>
  isObject(data) &&
  requiredPropIs(data, 'from', isNonEmptyString) &&
  requiredPropIs(data, 'to', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetCurrencyConversionsLimitsHttpOptions['response'] =>
  isObject(response) &&
  requiredPropIs(response, 'min', isNumber) &&
  requiredPropIs(response, 'max', isNumber)

export const getCurrencyConversionsLimits =
  internalCoinpaymentsFlow<GetCurrencyConversionsLimitsOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('from', 'to'))(withQueryParams())(
    withBody()
  )
