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
  operationId: 'createInvoice',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices`
} as const satisfies OperationOptions

export type CreateInvoiceOptions = typeof options

export type CreateInvoiceHttpOptions = {
  params: never
  queryParams: never
  body: Exclude<
    paths['/v2/merchant/invoices']['post']['requestBody'],
    undefined
  >['content']['application/json']
  response: paths['/v2/merchant/invoices']['post']['responses']['200']['content']['application/json']
}

export type CreateInvoiceOperation = CreateInvoiceOptions &
  CreateInvoiceHttpOptions

export const isValidAmount = (input: Record<string, unknown>): boolean => {
  if (!hasOwn(input, 'amount') || !isObject(input.amount)) return false
  if (!hasOwn(input.amount, 'total') || !isNonEmptyString(input.amount.total))
    return false
  if (!hasOwn(input.amount, 'breakdown') || !isObject(input.amount.breakdown))
    return false
  if (
    !hasOwn(input.amount.breakdown, 'subtotal') ||
    !isNonEmptyString(input.amount.breakdown.subtotal)
  )
    return false

  if (hasOwn(input.amount.breakdown, 'shipping')) {
    if (!isNonEmptyString(input.amount.breakdown.shipping)) {
      return false
    }
  }
  if (hasOwn(input.amount.breakdown, 'handling')) {
    if (!isNonEmptyString(input.amount.breakdown.handling)) {
      return false
    }
  }
  if (hasOwn(input.amount.breakdown, 'taxTotal')) {
    if (!isNonEmptyString(input.amount.breakdown.taxTotal)) {
      return false
    }
  }
  if (hasOwn(input.amount.breakdown, 'discount')) {
    if (!isNonEmptyString(input.amount.breakdown.discount)) {
      return false
    }
  }

  return true
}

export const isValidRequestData = (
  data: unknown
): data is RequestInput<CreateInvoiceOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'amount') || !isValidAmount(data)) return false
  if (!hasOwn(data, 'currency') || !isNonEmptyString(data.currency))
    return false
  if (!hasOwn(data, 'description') || !isNonEmptyString(data.description))
    return false
  if (!hasOwn(data, 'cancelUrl') || !isNonEmptyString(data.cancelUrl))
    return false
  if (!hasOwn(data, 'successUrl') || !isNonEmptyString(data.successUrl))
    return false
  return true
}

export const createInvoice = internalCoinpaymentsFlow<CreateInvoiceOperation>(
  options
)(isValidRequestData)(withParams())(withQueryParams())(
  withBody(
    'amount',
    'buyer',
    'buyerDataCollectionMessage',
    'clientId',
    'currency',
    'customData',
    'description',
    'draft',
    'dueDate',
    'emailDelivery',
    'hideShoppingCart',
    'invoiceDate',
    'invoiceId',
    'isEmailDelivery',
    'items',
    'merchantOptions',
    'notes',
    'notesToRecipient',
    'payment',
    'payoutOverrides',
    'poNumber',
    'requireBuyerNameAndEmail',
    'shipping',
    'termsAndConditions',
    'webhooks'
  )
)
