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
  operationId: 'getInvoicePayouts',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices/{id}/payouts`
} as const satisfies OperationOptions

export type GetInvoicePayoutsOptions = typeof options

export type GetInvoicePayoutsHttpOptions = {
  params: paths['/v2/merchant/invoices/{id}/payouts']['get']['parameters']['path']
  queryParams: never
  body: never
  response: paths['/v2/merchant/invoices/{id}/payouts']['get']['responses']['200']['content']['application/json']
}

export type GetInvoicePayoutsOperation = GetInvoicePayoutsOptions &
  GetInvoicePayoutsHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetInvoicePayoutsOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'id') || !isNonEmptyString(data.id)) return false
  return true
}

export const getInvoicePayouts =
  internalCoinpaymentsFlow<GetInvoicePayoutsOperation>(options)(
    isValidRequestData
  )(withParams('id'))(withQueryParams())(withBody())
