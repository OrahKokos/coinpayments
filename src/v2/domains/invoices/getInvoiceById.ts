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
  operationId: 'getInvoiceById',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices/{id}`
} as const satisfies OperationOptions

export type GetInvoiceByIdOptions = typeof options

export type GetInvoiceByIdParams = {
  /** @description string: invoice id */
  id: string
}

export type GetInvoiceByIdQueryParams = never

export type GetInvoiceByIdBody = never

export type GetInvoiceByIdResponse = {
  id?: string
  invoiceId?: string
  invoiceIdSuffix?: string
  created?: string
  invoiceDate?: string
  dueDate?: string
  status?: string
  amount?: object
  currency?: string
  description?: string
}

export type GetInvoiceByIdHttpOptions = {
  params: GetInvoiceByIdParams
  queryParams: GetInvoiceByIdQueryParams
  body: GetInvoiceByIdBody
  response: GetInvoiceByIdResponse
}

export type GetInvoiceByIdOperation = GetInvoiceByIdOptions &
  GetInvoiceByIdHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetInvoiceByIdOperation> =>
  isObject(input) && requiredPropIs(input, 'id', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetInvoiceByIdHttpOptions['response'] =>
  isObject(response) &&
  optionalPropIs(response, 'id', isNonEmptyString) &&
  optionalPropIs(response, 'invoiceId', isNonEmptyString) &&
  optionalPropIs(response, 'invoiceIdSuffix', isNonEmptyString) &&
  optionalPropIs(response, 'created', isNonEmptyString) &&
  optionalPropIs(response, 'invoiceDate', isNonEmptyString) &&
  optionalPropIs(response, 'dueDate', isNonEmptyString) &&
  optionalPropIs(response, 'status', isNonEmptyString) &&
  optionalPropIs(response, 'amount', isObject) &&
  optionalPropIs(response, 'currency', isNonEmptyString) &&
  optionalPropIs(response, 'description', isNonEmptyString)

export const getInvoiceById = internalCoinpaymentsFlow<GetInvoiceByIdOperation>(
  options
)(isValidRequestData)(isValidResponseData)(withParams('id'))(withQueryParams())(
  withBody()
)
