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
  operationId: 'updateWalletAddressWebhook',
  method: 'PUT',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/addresses/{addressIdStr}/webhook`
} as const satisfies OperationOptions

export type UpdateWalletAddressWebhookOptions = typeof options

export type UpdateWalletAddressWebhookHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}/addresses/{addressIdStr}/webhook']['put']['parameters']['path']
  queryParams: never
  body: NonNullable<
    paths['/v2/merchant/wallets/{walletIdStr}/addresses/{addressIdStr}/webhook']['put']['requestBody']
  >['content']['application/json']
  response: {} // No content response
}

export type UpdateWalletAddressWebhookOperation =
  UpdateWalletAddressWebhookOptions & UpdateWalletAddressWebhookHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<UpdateWalletAddressWebhookOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false
  if (!hasOwn(data, 'addressIdStr') || !isNonEmptyString(data.addressIdStr))
    return false
  if (
    !hasOwn(data, 'notificationUrl') ||
    !isNonEmptyString(data.notificationUrl)
  )
    return false

  return true
}

export const updateWalletAddressWebhook =
  internalCoinpaymentsFlow<UpdateWalletAddressWebhookOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr', 'addressIdStr'))(withQueryParams())(
    withBody('notificationUrl')
  )
