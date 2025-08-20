import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { isNonEmptyString, isObject, requiredPropIs } from '@src/utils/data'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { COINPAYMENTS_API_URL } from '../../constants'
import { Currency } from './types'
import { isValidCurrency } from './util'

export const options = {
  operationId: 'getCurrencyById',
  url: `${COINPAYMENTS_API_URL}/v2/currencies/{id}`,
  method: 'GET'
} as const satisfies OperationOptions

export type GetCurrencyByIdOptions = typeof options

export type GetCurrencyByIdHttpOptions = {
  params: {
    id: string
  }
  queryParams: never
  body: never
  response: Currency
}

export type GetCurrencyByIdOperation = GetCurrencyByIdOptions &
  GetCurrencyByIdHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetCurrencyByIdOperation> =>
  isObject(input) && requiredPropIs(input, 'id', isNonEmptyString)

export const isValidResponseData = isValidCurrency

export const getCurrencyById =
  internalCoinpaymentsFlow<GetCurrencyByIdOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams())(withBody())
