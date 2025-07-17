import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { isNonEmptyString, isObject } from '@src/utils/data'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { COINPAYMENTS_API_URL } from '../../constants'

import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'getCurrencyById',
  url: `${COINPAYMENTS_API_URL}/v2/currencies/{id}`,
  method: 'GET'
} as const satisfies OperationOptions

export type GetCurrencyByIdOptions = typeof options

export type GetCurrencyByIdHttpOptions = {
  params: paths['/v2/currencies/{id}']['get']['parameters']['path']
  queryParams: never
  body: never
  response: paths['/v2/currencies/{id}']['get']['responses']['200']['content']['application/json']
}

export type GetCurrencyByIdOperation = GetCurrencyByIdOptions &
  GetCurrencyByIdHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetCurrencyByIdOperation> => {
  if (!isObject(input)) return false
  if (!('id' in input)) return false
  if (!isNonEmptyString(input.id)) return false
  return true
}

export const getCurrencyById =
  internalCoinpaymentsFlow<GetCurrencyByIdOperation>(options)(
    isValidRequestData
  )(withParams('id'))(withQueryParams())(withBody())
