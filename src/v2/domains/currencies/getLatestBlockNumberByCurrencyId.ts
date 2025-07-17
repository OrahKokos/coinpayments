import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { hasOwn, isNonEmptyString, isObject } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '../../constants'
import { OperationOptions, RequestInput } from '../../types/operations'

import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'getLatestBlockNumberByCurrencyId',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/currencies/blockchain-nodes/{id}/latest-block-number`
} as const satisfies OperationOptions

export type GetLatestBlockNumberByCurrencyIdOptions = typeof options

export type GetLatestBlockNumberByCurrencyIdHttpOptions = {
  params: paths['/v2/currencies/blockchain-nodes/{id}/latest-block-number']['get']['parameters']['path']
  queryParams: never
  body: never
  response: paths['/v2/currencies/blockchain-nodes/{id}/latest-block-number']['get']['responses']['200']['content']['application/json']
}

export type GetLatestBlockNumberByCurrencyIdOperation =
  GetLatestBlockNumberByCurrencyIdOptions &
    GetLatestBlockNumberByCurrencyIdHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetLatestBlockNumberByCurrencyIdOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'id') || !isNonEmptyString(data.id)) return false
  return true
}

export const getLatestBlockNumberByCurrencyId =
  internalCoinpaymentsFlow<GetLatestBlockNumberByCurrencyIdOperation>(options)(
    isValidRequestData
  )(withParams('id'))(withQueryParams())(withBody())
