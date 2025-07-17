import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { hasOwn, isNonEmptyString, isObject } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'getInvoiceById',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices/{id}`
} as const satisfies OperationOptions

export type GetInvoiceByIdOptions = typeof options

export type GetInvoiceByIdHttpOptions = {
  params: paths['/v2/merchant/invoices/{id}']['get']['parameters']['path']
  queryParams: never
  body: never
  response: paths['/v2/merchant/invoices/{id}']['get']['responses']['200']['content']['application/json']
}

export type GetInvoiceByIdOperation = GetInvoiceByIdOptions &
  GetInvoiceByIdHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetInvoiceByIdOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'id') || !isNonEmptyString(data.id)) return false
  return true
}

export const getInvoiceById = internalCoinpaymentsFlow<GetInvoiceByIdOperation>(
  options
)(isValidRequestData)(withParams('id'))(withQueryParams())(withBody())
