import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { hasOwn, isNonEmptyString, isObject } from '@src/utils/data'
import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'getInvoiceHistory',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices/{id}/history`
} as const satisfies OperationOptions

export type GetInvoiceHistoryOptions = typeof options

export type GetInvoiceHistoryHttpOptions = {
  params: paths['/v2/merchant/invoices/{id}/history']['get']['parameters']['path']
  queryParams: never
  body: never
  response: paths['/v2/merchant/invoices/{id}/history']['get']['responses']['200']['content']['application/json']
}

export type GetInvoiceHistoryOperation = GetInvoiceHistoryOptions &
  GetInvoiceHistoryHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetInvoiceHistoryOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'id') || !isNonEmptyString(data.id)) return false
  return true
}

export const getInvoiceHistory =
  internalCoinpaymentsFlow<GetInvoiceHistoryOperation>(options)(
    isValidRequestData
  )(withParams('id'))(withQueryParams())(withBody())
