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
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

export const options = {
  operationId: 'getCurrencyBlockchainFee',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/fees/blockchain/{id}`
} as const satisfies OperationOptions

export type CurrencyBlockchainFeeOptions = typeof options

export type CurrencyBlockchainFeeHttpOptions = {
  params: {
    id: string
  }
  queryParams: never
  body: never
  response: number
}

export type CurrencyBlockchainFeeOperation = CurrencyBlockchainFeeOptions &
  CurrencyBlockchainFeeHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<CurrencyBlockchainFeeOperation> =>
  isObject(data) && requiredPropIs(data, 'id', isNonEmptyString)

export const isValidResponseData = isNumber

export const currencyBlockchainFee =
  internalCoinpaymentsFlow<CurrencyBlockchainFeeOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams())(withBody())
