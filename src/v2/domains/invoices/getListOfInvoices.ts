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
  operationId: 'getListOfInvoices',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices`
} as const satisfies OperationOptions

export type GetListOfInvoicesOptions = typeof options

export type GetListOfInvoicesHttpOptions = {
  params: never
  queryParams: paths['/v2/merchant/invoices']['get']['parameters']['query']
  body: never
  response: paths['/v2/merchant/invoices']['get']['responses']['200']['content']['application/json']
}
export type GetListOfInvoicesOperation = GetListOfInvoicesOptions &
  GetListOfInvoicesHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetListOfInvoicesOperation> => {
  if (!isObject(data)) return false
  if (hasOwn(data, 'status') && isNonEmptyString(data.status)) return false
  if (hasOwn(data, 'from') && isNonEmptyString(data.from)) return false
  if (hasOwn(data, 'to') && isNonEmptyString(data.to)) return false
  if (hasOwn(data, 'q') && isNonEmptyString(data.q)) return false
  if (hasOwn(data, 'integration') && isNonEmptyString(data.integration))
    return false
  if (hasOwn(data, 'payoutWalletId') && isNonEmptyString(data.payoutWalletId))
    return false
  if (hasOwn(data, 'limit') && isNonEmptyString(data.limit)) return false
  if (hasOwn(data, 'after') && isNonEmptyString(data.after)) return false
  return true // Currently, no specific validation is required
}

export const getListOfInvoices =
  internalCoinpaymentsFlow<GetListOfInvoicesOperation>(options)(
    isValidRequestData
  )(withParams())(
    withQueryParams(
      'status',
      'from',
      'to',
      'q',
      'integration',
      'payoutWalletId',
      'limit',
      'after'
    )
  )(withBody())
