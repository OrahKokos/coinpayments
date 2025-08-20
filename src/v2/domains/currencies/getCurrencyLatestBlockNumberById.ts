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
import { COINPAYMENTS_API_URL } from '../../constants'
import { OperationOptions, RequestInput } from '../../types/operations'

export const options = {
  operationId: 'getCurrencyLatestBlockNumberById',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/currencies/blockchain-nodes/{id}/latest-block-number`
} as const satisfies OperationOptions

export type GetLatestBlockNumberByCurrencyIdOptions = typeof options

export type GetLatestBlockNumberByCurrencyIdHttpOptions = {
  params: {
    id: string
  }
  queryParams: never
  body: never
  response: {
    currencyId: string
    latestBlockNumber: number
  }
}

export type GetLatestBlockNumberByCurrencyIdOperation =
  GetLatestBlockNumberByCurrencyIdOptions &
    GetLatestBlockNumberByCurrencyIdHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetLatestBlockNumberByCurrencyIdOperation> =>
  isObject(data) && requiredPropIs(data, 'id', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetLatestBlockNumberByCurrencyIdHttpOptions['response'] =>
  isObject(response) &&
  requiredPropIs(response, 'currencyId', isNonEmptyString) &&
  requiredPropIs(response, 'latestBlockNumber', isNumber)

export const getLatestBlockNumberByCurrencyId =
  internalCoinpaymentsFlow<GetLatestBlockNumberByCurrencyIdOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams())(withBody())
