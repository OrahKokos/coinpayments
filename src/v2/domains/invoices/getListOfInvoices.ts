import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { isNonEmptyString, isObject, optionalPropIs } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

export const options = {
  operationId: 'getListOfInvoices',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices`
} as const satisfies OperationOptions

export type GetListOfInvoicesOptions = typeof options

export type GetListOfInvoicesParams = never

export type GetListOfInvoicesQueryParams = {
  status?: string
  from?: string
  to?: string
  q?: string
  integration?: string
  payoutWalletId?: string
  limit?: number
  after?: string
}

export type GetListOfInvoicesBody = never

export type GetListOfInvoicesResponse = Array<{
  id?: string
  invoiceId?: string
  created?: string
  status?: string
  amount?: object
  currency?: string
  description?: string
}>

export type GetListOfInvoicesHttpOptions = {
  params: GetListOfInvoicesParams
  queryParams: GetListOfInvoicesQueryParams
  body: GetListOfInvoicesBody
  response: GetListOfInvoicesResponse
}
export type GetListOfInvoicesOperation = GetListOfInvoicesOptions &
  GetListOfInvoicesHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetListOfInvoicesOperation> =>
  isObject(input) &&
  optionalPropIs(input, 'status', isNonEmptyString) &&
  optionalPropIs(input, 'from', isNonEmptyString) &&
  optionalPropIs(input, 'to', isNonEmptyString) &&
  optionalPropIs(input, 'q', isNonEmptyString) &&
  optionalPropIs(input, 'integration', isNonEmptyString) &&
  optionalPropIs(input, 'payoutWalletId', isNonEmptyString) &&
  optionalPropIs(input, 'limit', isNonEmptyString) &&
  optionalPropIs(input, 'after', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetListOfInvoicesHttpOptions['response'] =>
  Array.isArray(response) &&
  response.every(
    (item) =>
      isObject(item) &&
      optionalPropIs(item, 'id', isNonEmptyString) &&
      optionalPropIs(item, 'invoiceId', isNonEmptyString) &&
      optionalPropIs(item, 'created', isNonEmptyString) &&
      optionalPropIs(item, 'status', isNonEmptyString) &&
      optionalPropIs(item, 'amount', isObject) &&
      optionalPropIs(item, 'currency', isNonEmptyString) &&
      optionalPropIs(item, 'description', isNonEmptyString)
  )

export const getListOfInvoices =
  internalCoinpaymentsFlow<GetListOfInvoicesOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams())(
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
