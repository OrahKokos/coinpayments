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
  operationId: 'getTransactionByWalletId',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/transaction`
} as const satisfies OperationOptions

export type GetTransactionByWalletIdOptions = typeof options

export type GetTransactionByWalletIdParams = {
  /** @description string: wallet id */
  walletIdStr: string
}

export type GetTransactionByWalletIdQueryParams = {
  /** @description string?: transaction id */
  transactionId?: string
  /** @description string?: spend request id */
  spendRequestId?: string
}

export type GetTransactionByWalletIdBody = never

export type GetTransactionByWalletIdResponse = {
  id?: string
  type?: string
  status?: string
  amount?: string
  currency?: string
  fee?: string
  txid?: string
  confirmations?: string
  address?: string
  fromAddress?: string
  toAddress?: string
  createdDate?: string
  lastUpdatedDate?: string
}

export type GetTransactionByWalletIdHttpOptions = {
  params: GetTransactionByWalletIdParams
  queryParams: GetTransactionByWalletIdQueryParams
  body: GetTransactionByWalletIdBody
  response: GetTransactionByWalletIdResponse
}

export type GetTransactionByWalletIdOperation =
  GetTransactionByWalletIdOptions & GetTransactionByWalletIdHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetTransactionByWalletIdOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'walletIdStr', isNonEmptyString) &&
  optionalPropIs(input, 'transactionId', isNonEmptyString) &&
  optionalPropIs(input, 'spendRequestId', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetTransactionByWalletIdHttpOptions['response'] =>
  isObject(response) &&
  optionalPropIs(response, 'id', isNonEmptyString) &&
  optionalPropIs(response, 'type', isNonEmptyString) &&
  optionalPropIs(response, 'status', isNonEmptyString) &&
  optionalPropIs(response, 'amount', isNonEmptyString) &&
  optionalPropIs(response, 'currency', isNonEmptyString) &&
  optionalPropIs(response, 'fee', isNonEmptyString) &&
  optionalPropIs(response, 'txid', isNonEmptyString) &&
  optionalPropIs(response, 'confirmations', isNonEmptyString) &&
  optionalPropIs(response, 'address', isNonEmptyString) &&
  optionalPropIs(response, 'fromAddress', isNonEmptyString) &&
  optionalPropIs(response, 'toAddress', isNonEmptyString) &&
  optionalPropIs(response, 'createdDate', isNonEmptyString) &&
  optionalPropIs(response, 'lastUpdatedDate', isNonEmptyString)

export const getTransactionByWalletId =
  internalCoinpaymentsFlow<GetTransactionByWalletIdOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('walletIdStr'))(
    withQueryParams('transactionId', 'spendRequestId')
  )(withBody())
