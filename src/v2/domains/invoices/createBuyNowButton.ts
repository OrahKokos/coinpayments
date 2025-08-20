import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  alwaysTrueGuard,
  isNonEmptyString,
  isObject,
  isPositiveNumber,
  isValidBoolean,
  optionalPropIs,
  requiredPropIs
} from '@src/utils/data'
import {
  COINPAYMENTS_API_URL,
  OperationOptions,
  RequestInput
} from '@src/v2/types/operations'

export const options = {
  operationId: 'createBuyNowButton',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices/buy-now-button`
} as const satisfies OperationOptions

export type CreateBuyNowButtonOptions = typeof options

export type CreateBuyNowButtonParams = never

export type CreateBuyNowButtonQueryParams = never

export type CreateBuyNowButtonBody = {
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
  hideShoppingCart?: boolean
  successUrl?: string
  cancelUrl?: string
  ipnUrl?: string
  notifications?: string
  emailNotifications?: boolean
  buttonWidth?: number
  buttonStyle?: string
  invoiceId?: string
  type?: string
  payoutOverrides?: Array<{
    fromCurrency: string
    toCurrency: string
    address: string
    frequency: string
  }>
}

export type CreateBuyNowButtonResponse = {
  buttonHtml?: string
  buttonUrl?: string
}

export type CreateBuyNowButtonHttpOptions = {
  params: CreateBuyNowButtonParams
  queryParams: CreateBuyNowButtonQueryParams
  body: CreateBuyNowButtonBody
  response: CreateBuyNowButtonResponse
}

export type CreateBuyNowButtonOperation = CreateBuyNowButtonOptions &
  CreateBuyNowButtonHttpOptions

export const isValidAmount = (input: Record<string, unknown>): boolean =>
  requiredPropIs(
    input,
    'amount',
    (amount): amount is CreateBuyNowButtonOperation['body']['amount'] =>
      isObject(amount) &&
      requiredPropIs(amount, 'total', isNonEmptyString) &&
      requiredPropIs(amount, 'breakdown', isObject) &&
      requiredPropIs(amount.breakdown, 'subtotal', isNonEmptyString) &&
      optionalPropIs(amount.breakdown, 'shipping', isNonEmptyString) &&
      optionalPropIs(amount.breakdown, 'handling', isNonEmptyString) &&
      optionalPropIs(amount.breakdown, 'taxTotal', isNonEmptyString) &&
      optionalPropIs(amount.breakdown, 'discount', isNonEmptyString)
  )

export const areValidItems = (input: Record<string, unknown>): boolean =>
  requiredPropIs(
    input,
    'items',
    (items): items is CreateBuyNowButtonOperation['body']['items'] =>
      Array.isArray(items) &&
      items.every(
        (item) =>
          isObject(item) &&
          requiredPropIs(item, 'name', isNonEmptyString) &&
          requiredPropIs(item, 'quantity', isObject) &&
          requiredPropIs(
            item.quantity,
            'value',
            (value): value is number => typeof value === 'number' && value > 0
          ) &&
          requiredPropIs(item.quantity, 'type', isNonEmptyString) &&
          requiredPropIs(item, 'amount', isNonEmptyString) &&
          optionalPropIs(item, 'description', isNonEmptyString) &&
          optionalPropIs(item, 'customId', isNonEmptyString) &&
          optionalPropIs(item, 'sku', isNonEmptyString) &&
          optionalPropIs(item, 'originalAmount', isNonEmptyString) &&
          optionalPropIs(item, 'tax', isNonEmptyString)
      )
  )

export const isValidFrequency = (value: unknown): value is string =>
  typeof value === 'string' &&
  ['normal', 'asSoonAsPossible', 'hourly', 'nightly', 'weekly'].includes(value)

export const isValidPayoutOverride = (
  override: unknown
): override is Record<string, unknown> =>
  isObject(override) &&
  requiredPropIs(override, 'fromCurrency', isNonEmptyString) &&
  requiredPropIs(override, 'toCurrency', isNonEmptyString) &&
  requiredPropIs(override, 'address', isNonEmptyString) &&
  requiredPropIs(override, 'frequency', isValidFrequency)

export const isValidPayoutOverrides = (
  overrides: unknown
): overrides is CreateBuyNowButtonOperation['body']['payoutOverrides'] =>
  Array.isArray(overrides) && overrides.every(isValidPayoutOverride)

export const isValidRequestData = (
  input: unknown
): input is RequestInput<CreateBuyNowButtonOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'currency', isNonEmptyString) &&
  isValidAmount(input) &&
  areValidItems(input) &&
  optionalPropIs(input, 'hideShoppingCart', isValidBoolean) &&
  optionalPropIs(input, 'successUrl', isNonEmptyString) &&
  optionalPropIs(input, 'cancelUrl', isNonEmptyString) &&
  optionalPropIs(input, 'ipnUrl', isNonEmptyString) &&
  optionalPropIs(input, 'notifications', isNonEmptyString) &&
  optionalPropIs(input, 'emailNotifications', isValidBoolean) &&
  optionalPropIs(input, 'buttonWidth', isPositiveNumber) &&
  optionalPropIs(input, 'buttonStyle', isNonEmptyString) &&
  optionalPropIs(input, 'invoiceId', isNonEmptyString) &&
  optionalPropIs(input, 'type', isNonEmptyString) &&
  optionalPropIs(input, 'payoutOverrides', isValidPayoutOverrides)

export const isValidResponseData =
  alwaysTrueGuard<CreateBuyNowButtonHttpOptions['response']>()

export const createBuyNowButton =
  internalCoinpaymentsFlow<CreateBuyNowButtonOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams())(withQueryParams())(
    withBody(
      'amount',
      'items',
      'buttonWidth',
      'buttonWidth',
      'buttonStyle',
      'type',
      'payoutOverrides',
      'currency',
      'successUrl',
      'cancelUrl',
      'ipnUrl',
      'notifications',
      'emailNotifications',
      'hideShoppingCart'
    )
  )
