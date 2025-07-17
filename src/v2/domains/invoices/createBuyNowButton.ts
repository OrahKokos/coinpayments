import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { hasOwn, isNonEmptyString, isObject } from '@src/utils/data'
import {
  COINPAYMENTS_API_URL,
  OperationOptions,
  RequestInput
} from '@src/v2/types/operations'

import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'createBuyNowButton',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices/buy-now-button`
} as const satisfies OperationOptions

export type CreateBuyNowButtonOptions = typeof options

export type CreateBuyNowButtonHttpOptions = {
  params: never
  queryParams: never
  body: Exclude<
    paths['/v2/merchant/invoices/buy-now-button']['post']['requestBody'],
    undefined
  >['content']['application/json']
  // unknown / not specified
  response: {}
}

export type CreateBuyNowButtonOperation = CreateBuyNowButtonOptions &
  CreateBuyNowButtonHttpOptions

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

export const areValidItems = (input: Record<string, unknown>) => {
  if (!hasOwn(input, 'items') || !Array.isArray(input.items)) return false

  return input.items.every((item) => {
    if (!isObject(item)) return false
    if (!hasOwn(item, 'name') || !isNonEmptyString(item.name)) return false
    if (!hasOwn(item, 'quantity') || !isObject(item.quantity)) return false
    if (
      !hasOwn(item.quantity, 'value') ||
      typeof item.quantity.value !== 'number' ||
      item.quantity.value <= 0
    )
      return false
    if (!hasOwn(item.quantity, 'type') || !isNonEmptyString(item.quantity.type))
      return false
    if (!hasOwn(item, 'amount') || !isNonEmptyString(item.amount)) return false

    if (hasOwn(item, 'description') && !isNonEmptyString(item.description))
      return false
    if (hasOwn(item, 'customId') && !isNonEmptyString(item.customId))
      return false
    if (hasOwn(item, 'sku') && !isNonEmptyString(item.sku)) return false
    if (
      hasOwn(item, 'originalAmount') &&
      !isNonEmptyString(item.originalAmount)
    )
      return false
    if (hasOwn(item, 'tax') && !isNonEmptyString(item.tax)) return false

    return true
  })
}

export const isValidRequestData = (
  input: unknown
): input is RequestInput<CreateBuyNowButtonOperation> => {
  if (!isObject(input)) return false
  if (!hasOwn(input, 'currency') || !isNonEmptyString(input.currency))
    return false
  if (!isValidAmount(input)) return false
  if (!areValidItems(input)) return false
  if (
    hasOwn(input, 'hideShoppingCart') &&
    typeof input.hideShoppingCart !== 'boolean'
  )
    return false
  if (hasOwn(input, 'successUrl') && !isNonEmptyString(input.successUrl))
    return false
  if (hasOwn(input, 'cancelUrl') && !isNonEmptyString(input.cancelUrl))
    return false
  if (hasOwn(input, 'ipnUrl') && !isNonEmptyString(input.ipnUrl)) return false
  if (hasOwn(input, 'notifications') && !isNonEmptyString(input.notifications))
    return false
  if (
    hasOwn(input, 'emailNotifications') &&
    typeof input.emailNotifications !== 'boolean'
  )
    return false
  if (
    hasOwn(input, 'buttonWidth') &&
    (typeof input.buttonWidth !== 'number' || input.buttonWidth <= 0)
  )
    return false
  if (hasOwn(input, 'buttonStyle') && !isNonEmptyString(input.buttonStyle))
    return false
  if (hasOwn(input, 'invoiceId') && !isNonEmptyString(input.invoiceId))
    return false
  if (hasOwn(input, 'type') && !isNonEmptyString(input.type)) return false
  if (
    hasOwn(input, 'payoutOverrides') &&
    (!Array.isArray(input.payoutOverrides) ||
      !input.payoutOverrides.every((override) => {
        if (!isObject(override)) return false
        if (
          !hasOwn(override, 'fromCurrency') ||
          !isNonEmptyString(override.fromCurrency)
        )
          return false
        if (
          !hasOwn(override, 'toCurrency') ||
          !isNonEmptyString(override.toCurrency)
        )
          return false
        if (!hasOwn(override, 'address') || !isNonEmptyString(override.address))
          return false
        if (
          !hasOwn(override, 'frequency') ||
          typeof override.frequency !== 'string' ||
          ![
            'normal',
            'asSoonAsPossible',
            'hourly',
            'nightly',
            'weekly'
          ].includes(override.frequency)
        )
          return false
        return true
      }))
  )
    return false

  return true
}

export const createBuyNowButton =
  internalCoinpaymentsFlow<CreateBuyNowButtonOperation>(options)(
    isValidRequestData
  )(withParams())(withQueryParams())(
    withBody(
      'amount',
      'buttonWidth',
      'buttonWidth',
      'buttonStyle',
      'type',
      'payoutOverrides',
      'items',
      'currency',
      'successUrl',
      'cancelUrl',
      'ipnUrl',
      'notifications',
      'emailNotifications',
      'hideShoppingCart'
    )
  )
