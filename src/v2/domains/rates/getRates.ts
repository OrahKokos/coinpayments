import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isNonEmptyString,
  isObject,
  optionalPropIs,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

export const options = {
  operationId: 'getRates',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/rates`
} as const satisfies OperationOptions

export type GetRatesOptions = typeof options

export type GetRatesHttpOptions = {
  params: never
  queryParams: {
    from?: string
    to?: string
  }
  body: never
  response: {
    items: Array<{
      baseCurrencyId: string
      baseSymbol: string
      quoteCurrencyId: string
      quoteSymbol: string
      rate: string
    }>
  }
}

export type GetRatesOperation = GetRatesOptions & GetRatesHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetRatesOperation> =>
  isObject(input) &&
  optionalPropIs(input, 'from', isNonEmptyString) &&
  optionalPropIs(input, 'to', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetRatesHttpOptions['response'] =>
  isObject(response) &&
  requiredPropIs(response, 'items', Array.isArray) &&
  response.items.every(
    (item) =>
      isObject(item) &&
      requiredPropIs(item, 'baseCurrencyId', isNonEmptyString) &&
      requiredPropIs(item, 'baseSymbol', isNonEmptyString) &&
      requiredPropIs(item, 'quoteCurrencyId', isNonEmptyString) &&
      requiredPropIs(item, 'quoteSymbol', isNonEmptyString) &&
      requiredPropIs(item, 'rate', isNonEmptyString)
  )

export const getRates = internalCoinpaymentsFlow<GetRatesOperation>(options)(
  isValidRequestData
)(isValidResponseData)(withParams())(withQueryParams('from', 'to'))(withBody())
