import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { alwaysTrueGuard } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'walletNotificationPayload',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/your-server-url`
} as const satisfies OperationOptions

export type WalletNotificationPayloadOptions = typeof options

export type WalletNotificationPayloadHttpOptions = {
  params: never
  queryParams: never
  body: never
  response: paths['/v2/merchant/wallets/your-server-url']['post']['responses']['200']['content']['application/json']
}

export type WalletNotificationPayloadOperation =
  WalletNotificationPayloadOptions & WalletNotificationPayloadHttpOptions

export const isValidRequestData =
  alwaysTrueGuard<RequestInput<WalletNotificationPayloadOperation>>()

export const walletNotificationPayload =
  internalCoinpaymentsFlow<WalletNotificationPayloadOperation>(options)(
    isValidRequestData
  )(withParams())(withQueryParams())(withBody())
