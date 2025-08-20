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
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

export const options = {
  operationId: 'updateWalletAddressWebhook',
  method: 'PUT',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/addresses/{addressIdStr}/webhook`
} as const satisfies OperationOptions

export type UpdateWalletAddressWebhookOptions = typeof options

export type UpdateWalletAddressWebhookParams = {
  /** @description string: wallet id */
  walletIdStr: string
  /** @description string: address id */
  addressIdStr: string
}

export type UpdateWalletAddressWebhookQueryParams = never

export type UpdateWalletAddressWebhookBody = {
  notificationUrl: string
}

export type UpdateWalletAddressWebhookResponse = {} // No content response

export type UpdateWalletAddressWebhookHttpOptions = {
  params: UpdateWalletAddressWebhookParams
  queryParams: UpdateWalletAddressWebhookQueryParams
  body: UpdateWalletAddressWebhookBody
  response: UpdateWalletAddressWebhookResponse
}

export type UpdateWalletAddressWebhookOperation =
  UpdateWalletAddressWebhookOptions & UpdateWalletAddressWebhookHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<UpdateWalletAddressWebhookOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'walletIdStr', isNonEmptyString) &&
  requiredPropIs(input, 'addressIdStr', isNonEmptyString) &&
  requiredPropIs(input, 'notificationUrl', isNonEmptyString)

export const isValidResponseData =
  alwaysTrueGuard<UpdateWalletAddressWebhookHttpOptions['response']>()

export const updateWalletAddressWebhook =
  internalCoinpaymentsFlow<UpdateWalletAddressWebhookOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('walletIdStr', 'addressIdStr'))(
    withQueryParams()
  )(withBody('notificationUrl'))
