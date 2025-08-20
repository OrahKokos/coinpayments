// TODO: This endpoint returns a number response type, which is not currently supported by the internalCoinpaymentsFlow.
// The response type constraint expects objects or arrays, but this endpoint returns a plain number.
// This file needs to be moved to handle the number response type properly.

import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isNonEmptyString,
  isNumber,
  isObject,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

export const options = {
  operationId: 'getMerchantWalletsTransactionsCount',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/transactions/count`
} as const satisfies OperationOptions

export type GetMerchantWalletsTransactionsCountOptions = typeof options

export type GetMerchantWalletsTransactionsCountParams = {
  /** @description string: wallet id */
  walletIdStr: string
}

export type GetMerchantWalletsTransactionsCountQueryParams = never

export type GetMerchantWalletsTransactionsCountBody = never

export type GetMerchantWalletsTransactionsCountResponse = number

export type GetMerchantWalletsTransactionsCountHttpOptions = {
  params: GetMerchantWalletsTransactionsCountParams
  queryParams: GetMerchantWalletsTransactionsCountQueryParams
  body: GetMerchantWalletsTransactionsCountBody
  response: GetMerchantWalletsTransactionsCountResponse
}

export type GetMerchantWalletsTransactionsCountOperation =
  GetMerchantWalletsTransactionsCountOptions &
    GetMerchantWalletsTransactionsCountHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetMerchantWalletsTransactionsCountOperation> =>
  isObject(input) && requiredPropIs(input, 'walletIdStr', isNonEmptyString)

export const isValidResponseData = (input: unknown): input is number =>
  isNumber(input)

export const getMerchantWalletsTransactionsCount =
  internalCoinpaymentsFlow<GetMerchantWalletsTransactionsCountOperation>(
    options
  )(isValidRequestData)(isValidResponseData)(withParams('walletIdStr'))(
    withQueryParams()
  )(withBody())
