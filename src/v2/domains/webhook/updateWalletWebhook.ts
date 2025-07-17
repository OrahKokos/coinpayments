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
  operationId: 'updateWalletWebhook',
  method: 'PUT',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/webhook`
} as const satisfies OperationOptions

export type UpdateWalletWebhookOptions = typeof options

export type UpdateWalletWebhookHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}/webhook']['put']['parameters']['path']
  queryParams: never
  body: NonNullable<
    paths['/v2/merchant/wallets/{walletIdStr}/webhook']['put']['requestBody']
  >['content']['application/json']
  response: {} // No content response
}

export type UpdateWalletWebhookOperation = UpdateWalletWebhookOptions &
  UpdateWalletWebhookHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<UpdateWalletWebhookOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false
  if (
    !hasOwn(data, 'notificationUrl') ||
    !isNonEmptyString(data.notificationUrl)
  )
    return false

  return true
}

export const updateWalletWebhook =
  internalCoinpaymentsFlow<UpdateWalletWebhookOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr'))(withQueryParams())(withBody('notificationUrl'))
