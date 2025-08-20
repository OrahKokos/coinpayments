import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isNonEmptyString,
  isObject,
  isValidBoolean,
  optionalPropIs,
  requiredPropIs
} from '@src/utils/data'

export const options = {
  operationId: 'createInvoice',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices`
} as const satisfies OperationOptions

export type CreateInvoiceOptions = typeof options

export type CreateInvoiceParams = never

export type CreateInvoiceQueryParams = never

export type CreateInvoiceBody = {
  currency: string
  amount: {
    total: string
    breakdown: {
      subtotal: string
      shipping?: string
      handling?: string
      taxTotal?: string
      discount?: string
    }
  }
  items: Array<{
    name: string
    quantity: {
      value: number
      type: string
    }
    amount: string
    description?: string
    customId?: string
    sku?: string
    originalAmount?: string
    tax?: string
  }>
  isEmailDelivery: boolean
  draft: boolean
  invoiceId: string
  emailDelivery?: object
  dueDate?: string
  invoiceDate?: string
  clientId?: string
  buyer?: object
  description?: string
  shipping?: object
  requireBuyerNameAndEmail?: boolean
  buyerDataCollectionMessage?: string
  notes?: string
  notesToRecipient?: string
  termsAndConditions?: string
  merchantOptions?: object
  customData?: object
  poNumber?: string
  webhooks?: unknown[]
  payoutOverrides?: object
  payment?: object
  hideShoppingCart?: boolean
}

export type CreateInvoiceResponse = {
  id?: string
  invoiceId?: string
  status?: string
  url?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateInvoiceHttpOptions = {
  params: CreateInvoiceParams
  queryParams: CreateInvoiceQueryParams
  body: CreateInvoiceBody
  response: CreateInvoiceResponse
}

export type CreateInvoiceOperation = CreateInvoiceOptions &
  CreateInvoiceHttpOptions

export const isValidAmount = (input: Record<string, unknown>): boolean =>
  requiredPropIs(
    input,
    'amount',
    (amount): amount is CreateInvoiceOperation['body']['amount'] =>
      isObject(amount) &&
      requiredPropIs(amount, 'total', isNonEmptyString) &&
      requiredPropIs(amount, 'breakdown', isObject) &&
      requiredPropIs(amount.breakdown, 'subtotal', isNonEmptyString) &&
      optionalPropIs(amount.breakdown, 'shipping', isNonEmptyString) &&
      optionalPropIs(amount.breakdown, 'handling', isNonEmptyString) &&
      optionalPropIs(amount.breakdown, 'taxTotal', isNonEmptyString) &&
      optionalPropIs(amount.breakdown, 'discount', isNonEmptyString)
  )

// 'invoice-v2': {
//       /** @description currency in which invoice has been issued */
//       currency: string
//       /** @description array of items that a buyer intends to purchase from the merchant */
//       items: components['schemas']['items-v2'][]
//       /** @description detailed amount of purchase with the breakdown of all fees in the simple crypto units */
//       amount: {
//         breakdown: {
//           /** @description sum of purchased items */
//           subtotal: string
//           /** @description cost of shipping */
//           shipping?: string
//           /** @description service cost for processing order */
//           handling?: string
//           /** @description tax cost */
//           taxTotal?: string
//           /** @description discount amount */
//           discount?: string
//         }
//         /** @description total amount of the invoice */
//         total: string
//       }
//       /**
//        * @description default value to be used for whitelabeling checkout flow. For invoice document delivery indicates if invoice will be email delivered
//        * @default false
//        */
//       isEmailDelivery: boolean
//       /** @description email addresses to be used for invoice delivery */
//       emailDelivery?: {
//         /** @description to email address. The value can take multiple addresses separated by semicolons */
//         to?: string
//         /** @description field to add multiple recipients separated by semicolons */
//         cc?: string
//         /** @description bcc field similar to "cc" field except that other recipients won't be able to see that someone else has been sent a copy of the email */
//         bcc?: string
//       }
//       /**
//        * @description date until invoice document is due
//        * @example 2023-04-26T18:40:41.322Z
//        */
//       dueDate?: string
//       /**
//        * @description to be used for invoice doc delivery. Date when invoice is to be mailed out to the user or activated for payment
//        * @example 2022-11-28T13:59:46+00:00
//        */
//       invoiceDate?: string
//       /**
//        * @description Default value to be used for whitelabeling checkout flow. Flag indicating whether this is a draft invoice
//        * @default false
//        */
//       draft: boolean
//       /** @description the id of the client (merchant) creating this invoice */
//       clientId?: string
//       /**
//        * @description default value to be used for whitelabeling checkout flow. For invoice document delivery invoice number assigned by the merchant
//        * @default false
//        */
//       invoiceId: string
//       buyer?: components['schemas']['buyer']
//       /** @description the purchase description, can be provided instead of a list of items */
//       description?: string
//       /** @description shipping method info */
//       shipping?: components['schemas']['shipping']
//       /** @description flag indicating whether a buyer name and email are required, they will be requested at checkout if not provider by the caller. */
//       requireBuyerNameAndEmail?: boolean
//       /** @description the message to display when collecting buyer user data */
//       buyerDataCollectionMessage?: string
//       /** @description notes for the merchant only, these are not visible to the buyers */
//       notes?: string
//       /** @description any additional information to share with the buyer about the transaction */
//       notesToRecipient?: string
//       /** @description any terms and conditions, e.g. a cancellation policy */
//       termsAndConditions?: string
//       /** @description merchant's details to be shown on the invoice */
//       merchantOptions?: components['schemas']['merchantOptions']
//       /** @description any custom data merchant wishes to attach to the invoice that may be further used for custom merchant's purposes. Not visible on UI for buyers */
//       customData?: Record<string, never>
//       /** @description optional Purchase order number on the integration API */
//       poNumber?: string
//       /** @description data on webhooks sent for the invoice */
//       webhooks?: {
//         notificationsUrl?: components['schemas']['webhook-url']
//         notifications?: components['schemas']['webhook-notification-array']
//       }[]
//       payoutOverrides?: components['schemas']['payout-overrides']
//       /** @description the field contains additional data specific for whitelabeled payments, e.g. buyer's email that is used for possible refunds */
//       payment?: {
//         /** @description id of the currency to conduct payment of the invoice. By providing this value in the 'createInvoice' request, merchant automatically generates payment address for the identified currency. The response in this case will contain payment address (HotWallet) information for buyer to make a payment. In case 'paymentCurrency' is not specified in the 'createInvoice' request, the response will contain the list of all available currencies for payment. Selecting the address for payment should be triggered as a separate action by using 'getPaymentAddressByCurrency' endpoint */
//         paymentCurrency?: string
//         /** @description Provide the buyer’s email address to create a white-labeling payment flow. **Note**, the email is only used for transaction status updates and refunds; never for marketing purposes */
//         refundEmail?: string
//       }
//       /** @description flag for hiding shopping cart in the checkout window. By default is 'false'. If set to 'true', shopping cart icon in the checkout window is not displayed */
//       hideShoppingCart?: boolean
//     }

export const isValidRequestData = (
  input: unknown
): input is RequestInput<CreateInvoiceOperation> =>
  isObject(input) &&
  // Required fields
  isValidAmount(input) &&
  requiredPropIs(input, 'currency', isNonEmptyString) &&
  requiredPropIs(input, 'items', Array.isArray) &&
  requiredPropIs(input, 'isEmailDelivery', isValidBoolean) &&
  requiredPropIs(input, 'draft', isValidBoolean) &&
  requiredPropIs(input, 'invoiceId', isNonEmptyString) &&
  optionalPropIs(input, 'emailDelivery', isObject) &&
  optionalPropIs(input, 'dueDate', isNonEmptyString) &&
  optionalPropIs(input, 'invoiceDate', isNonEmptyString) &&
  optionalPropIs(input, 'clientId', isNonEmptyString) &&
  optionalPropIs(input, 'buyer', isObject) &&
  optionalPropIs(input, 'description', isNonEmptyString) &&
  optionalPropIs(input, 'shipping', isObject) &&
  optionalPropIs(input, 'requireBuyerNameAndEmail', isValidBoolean) &&
  optionalPropIs(input, 'buyerDataCollectionMessage', isNonEmptyString) &&
  optionalPropIs(input, 'notes', isNonEmptyString) &&
  optionalPropIs(input, 'notesToRecipient', isNonEmptyString) &&
  optionalPropIs(input, 'termsAndConditions', isNonEmptyString) &&
  optionalPropIs(input, 'merchantOptions', isObject) &&
  optionalPropIs(input, 'customData', isObject) &&
  optionalPropIs(input, 'poNumber', isNonEmptyString) &&
  optionalPropIs(input, 'webhooks', Array.isArray) &&
  optionalPropIs(input, 'payoutOverrides', isObject) &&
  optionalPropIs(input, 'payment', isObject) &&
  optionalPropIs(input, 'hideShoppingCart', isValidBoolean)

export const isValidResponseData = (
  response: unknown
): response is CreateInvoiceHttpOptions['response'] => {
  // All fields are optional based on the OpenAPI spec
  return (
    isObject(response) &&
    optionalPropIs(response, 'id', isNonEmptyString) &&
    optionalPropIs(response, 'invoiceId', isNonEmptyString) &&
    optionalPropIs(response, 'invoiceIdSuffix', isNonEmptyString) &&
    optionalPropIs(response, 'created', isNonEmptyString) &&
    optionalPropIs(response, 'invoiceDate', isNonEmptyString) &&
    optionalPropIs(response, 'dueDate', isNonEmptyString) &&
    optionalPropIs(response, 'expirationDate', isNonEmptyString) &&
    optionalPropIs(response, 'status', isNonEmptyString) &&
    optionalPropIs(response, 'statusPayments', isNonEmptyString) &&
    optionalPropIs(response, 'statusPayouts', isNonEmptyString) &&
    optionalPropIs(response, 'amount', isObject) &&
    optionalPropIs(response, 'currency', isNonEmptyString) &&
    optionalPropIs(response, 'description', isNonEmptyString) &&
    optionalPropIs(response, 'cancelUrl', isNonEmptyString) &&
    optionalPropIs(response, 'successUrl', isNonEmptyString) &&
    optionalPropIs(response, 'draft', isValidBoolean) &&
    optionalPropIs(response, 'archived', isValidBoolean) &&
    optionalPropIs(response, 'customData', isObject) &&
    optionalPropIs(response, 'buyer', isObject)
  )
}

export const createInvoice = internalCoinpaymentsFlow<CreateInvoiceOperation>(
  options
)(isValidRequestData)(isValidResponseData)(withParams())(withQueryParams())(
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
