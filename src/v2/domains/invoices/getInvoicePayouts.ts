import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isNonEmptyString,
  isObject,
  optionalPropIs,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

export const options = {
  operationId: 'getInvoicePayouts',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices/{id}/payouts`
} as const satisfies OperationOptions

export type GetInvoicePayoutsOptions = typeof options

export type GetInvoicePayoutsParams = {
  /** @description string: invoice id */
  id: string
}

export type GetInvoicePayoutsQueryParams = never

export type GetInvoicePayoutsBody = never

export type GetInvoicePayoutsResponse = Array<{
  id?: string
  dateCreated?: string
  amount?: string
  currency?: string
  status?: string
  type?: string
}>

export type GetInvoicePayoutsHttpOptions = {
  params: GetInvoicePayoutsParams
  queryParams: GetInvoicePayoutsQueryParams
  body: GetInvoicePayoutsBody
  response: GetInvoicePayoutsResponse
}

export type GetInvoicePayoutsOperation = GetInvoicePayoutsOptions &
  GetInvoicePayoutsHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetInvoicePayoutsOperation> =>
  isObject(input) && requiredPropIs(input, 'id', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetInvoicePayoutsHttpOptions['response'] =>
  Array.isArray(response) &&
  response.every(
    (item) =>
      isObject(item) &&
      optionalPropIs(item, 'id', isNonEmptyString) &&
      optionalPropIs(item, 'dateCreated', isNonEmptyString) &&
      optionalPropIs(item, 'amount', isNonEmptyString) &&
      optionalPropIs(item, 'currency', isNonEmptyString) &&
      optionalPropIs(item, 'status', isNonEmptyString) &&
      optionalPropIs(item, 'type', isNonEmptyString)
  )

export const getInvoicePayouts =
  internalCoinpaymentsFlow<GetInvoicePayoutsOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams())(withBody())
