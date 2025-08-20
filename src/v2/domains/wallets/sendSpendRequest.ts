import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isNonEmptyString,
  isObject,
  optionalPropIs,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

export const options = {
  operationId: 'sendSpendRequest',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/spend/request`
} as const satisfies OperationOptions

export type SendSpendRequestOptions = typeof options

export type SendSpendRequestParams = {
  /** @description string: wallet id */
  walletIdStr: string
}

export type SendSpendRequestQueryParams = never

export type SendSpendRequestBody = {
  amount: string
  toAddress: string
  toCurrency: string
  amountCurrency?: string
  memo?: string
  receiverPaysFee?: string
  walletToPayFeeFrom?: string
}

export type SendSpendRequestResponse = {
  id?: string
  dateCreated?: string
  dateCompleted?: string
  fromOwnerId?: string
  fromWalletId?: string
  toWalletId?: string
  amount?: string
  currency?: string
  toAddress?: string
  toCurrency?: string
  status?: string
  type?: string
  memo?: string
  spendRequestId?: string
}

export type SendSpendRequestHttpOptions = {
  params: SendSpendRequestParams
  queryParams: SendSpendRequestQueryParams
  body: SendSpendRequestBody
  response: SendSpendRequestResponse
}

export type SendSpendRequestOperation = SendSpendRequestOptions &
  SendSpendRequestHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<SendSpendRequestOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'walletIdStr', isNonEmptyString) &&
  requiredPropIs(input, 'amount', isNonEmptyString) &&
  requiredPropIs(input, 'toAddress', isNonEmptyString) &&
  requiredPropIs(input, 'toCurrency', isNonEmptyString) &&
  optionalPropIs(input, 'amountCurrency', isNonEmptyString) &&
  optionalPropIs(input, 'memo', isNonEmptyString) &&
  optionalPropIs(input, 'receiverPaysFee', isNonEmptyString) &&
  optionalPropIs(input, 'walletToPayFeeFrom', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is SendSpendRequestHttpOptions['response'] =>
  isObject(response) &&
  optionalPropIs(response, 'id', isNonEmptyString) &&
  optionalPropIs(response, 'dateCreated', isNonEmptyString) &&
  optionalPropIs(response, 'dateCompleted', isNonEmptyString) &&
  optionalPropIs(response, 'fromOwnerId', isNonEmptyString) &&
  optionalPropIs(response, 'fromWalletId', isNonEmptyString) &&
  optionalPropIs(response, 'toWalletId', isNonEmptyString) &&
  optionalPropIs(response, 'amount', isNonEmptyString) &&
  optionalPropIs(response, 'currency', isNonEmptyString) &&
  optionalPropIs(response, 'toAddress', isNonEmptyString) &&
  optionalPropIs(response, 'toCurrency', isNonEmptyString) &&
  optionalPropIs(response, 'status', isNonEmptyString) &&
  optionalPropIs(response, 'type', isNonEmptyString) &&
  optionalPropIs(response, 'memo', isNonEmptyString) &&
  optionalPropIs(response, 'spendRequestId', isNonEmptyString)

export const sendSpendRequest =
  internalCoinpaymentsFlow<SendSpendRequestOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('walletIdStr'))(withQueryParams())(
    withBody(
      'amount',
      'toAddress',
      'toCurrency',
      'amountCurrency',
      'memo',
      'receiverPaysFee',
      'walletToPayFeeFrom'
    )
  )
