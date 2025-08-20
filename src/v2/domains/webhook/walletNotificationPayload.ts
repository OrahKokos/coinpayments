import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  inArray,
  isNonEmptyString,
  isNumber,
  isObject,
  optionalPropIs,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

export const options = {
  operationId: 'walletNotificationPayload',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{serverUrl}`
} as const satisfies OperationOptions

export type WalletNotificationPayloadOptions = typeof options

export type WalletNotificationPayloadParams = {
  /** @description string: server url */
  serverUrl: string
}

export type WalletNotificationPayloadQueryParams = never

export type WalletNotificationPayloadBody = never

export type WalletNotificationPayloadResponse = {
  walletId?: string
  address?: string
  transactionId?: string
  txHash?: string
  transactionStatus?:
    | 'unknown'
    | 'created'
    | 'pending'
    | 'processing'
    | 'completed'
    | 'expired'
    | 'failed'
    | 'confirmedOnBlockchain'
    | 'pendingReceive'
    | 'failedOnBlockchain'
    | 'cancelled'
    | 'rejected'
  spendRequestId?: string
  transactionType?: string
  amount?: number
  symbol?: string
  coinPaymentsFee?: number
  coinPaymentsFeeSymbol?: string
  blockchainFee?: string
  blockchainFeeSymbol?: string
  totalAmount?: string
  totalAmountSymbol?: string
  nativeAmount?: number
  coinPaymentsFeeNativeAmount?: string
  blockchainFeeNativeAmount?: string
  totalNativeAmount?: string
  nativeSymbol?: string
  confirmations?: number
  requiredConfirmations?: number
}

export type WalletNotificationPayloadHttpOptions = {
  params: WalletNotificationPayloadParams
  queryParams: WalletNotificationPayloadQueryParams
  body: WalletNotificationPayloadBody
  response: WalletNotificationPayloadResponse
}

export type WalletNotificationPayloadOperation =
  WalletNotificationPayloadOptions & WalletNotificationPayloadHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<WalletNotificationPayloadOperation> =>
  isObject(input) && requiredPropIs(input, 'serverUrl', isNonEmptyString)

export const isValidResponseData = (
  input: unknown
): input is WalletNotificationPayloadHttpOptions['response'] =>
  isObject(input) &&
  optionalPropIs(input, 'walletId', isNonEmptyString) &&
  optionalPropIs(input, 'address', isNonEmptyString) &&
  optionalPropIs(input, 'transactionId', isNonEmptyString) &&
  optionalPropIs(input, 'txHash', isNonEmptyString) &&
  optionalPropIs(
    input,
    'transactionStatus',
    inArray([
      'unknown',
      'created',
      'pending',
      'processing',
      'completed',
      'expired',
      'failed',
      'confirmedOnBlockchain',
      'pendingReceive',
      'failedOnBlockchain',
      'cancelled',
      'rejected'
    ])
  ) &&
  optionalPropIs(input, 'spendRequestId', isNonEmptyString) &&
  optionalPropIs(input, 'transactionType', isNonEmptyString) &&
  optionalPropIs(input, 'amount', isNumber) &&
  optionalPropIs(input, 'symbol', isNonEmptyString) &&
  optionalPropIs(input, 'coinPaymentsFee', isNumber) &&
  optionalPropIs(input, 'coinPaymentsFeeSymbol', isNonEmptyString) &&
  optionalPropIs(input, 'blockchainFee', isNonEmptyString) &&
  optionalPropIs(input, 'blockchainFeeSymbol', isNonEmptyString) &&
  optionalPropIs(input, 'totalAmount', isNonEmptyString) &&
  optionalPropIs(input, 'totalAmountSymbol', isNonEmptyString) &&
  optionalPropIs(input, 'nativeAmount', isNumber) &&
  optionalPropIs(input, 'coinPaymentsFeeNativeAmount', isNonEmptyString) &&
  optionalPropIs(input, 'blockchainFeeNativeAmount', isNonEmptyString) &&
  optionalPropIs(input, 'totalNativeAmount', isNonEmptyString) &&
  optionalPropIs(input, 'nativeSymbol', isNonEmptyString) &&
  optionalPropIs(input, 'confirmations', isNumber) &&
  optionalPropIs(input, 'requiredConfirmations', isNumber)

export const walletNotificationPayload =
  internalCoinpaymentsFlow<WalletNotificationPayloadOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams())(withQueryParams())(withBody())
