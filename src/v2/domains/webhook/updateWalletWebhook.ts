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
  operationId: 'updateWalletWebhook',
  method: 'PUT',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/webhook`
} as const satisfies OperationOptions

export type UpdateWalletWebhookOptions = typeof options

export type UpdateWalletWebhookParams = {
  /** @description string: wallet id */
  walletIdStr: string
}

export type UpdateWalletWebhookQueryParams = never

export type UpdateWalletWebhookBody = {
  notificationUrl: string
}

export type UpdateWalletWebhookResponse = {} // No content response

export type UpdateWalletWebhookHttpOptions = {
  params: UpdateWalletWebhookParams
  queryParams: UpdateWalletWebhookQueryParams
  body: UpdateWalletWebhookBody
  response: UpdateWalletWebhookResponse
}

export type UpdateWalletWebhookOperation = UpdateWalletWebhookOptions &
  UpdateWalletWebhookHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<UpdateWalletWebhookOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'walletIdStr', isNonEmptyString) &&
  requiredPropIs(input, 'notificationUrl', isNonEmptyString)

export const isValidResponseData =
  alwaysTrueGuard<UpdateWalletWebhookHttpOptions['response']>()

export const updateWalletWebhook =
  internalCoinpaymentsFlow<UpdateWalletWebhookOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('walletIdStr'))(withQueryParams())(
    withBody('notificationUrl')
  )
