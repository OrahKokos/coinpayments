// TODO: This endpoint returns a number response type, which is not currently supported by the internalCoinpaymentsFlow.
// The response type constraint expects objects or arrays, but this endpoint returns a plain number.
// This file needs to be moved to handle the number response type properly.

import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { alwaysTrueGuard, isNumber } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions } from '@src/v2/types/operations'

export const options = {
  operationId: 'getMerchantWalletsCount',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/count`
} as const satisfies OperationOptions

export type GetMerchantWalletsCountOptions = typeof options

export type GetMerchantWalletsCountHttpOptions = {
  params: never
  queryParams: never
  body: never
  response: number
}
export type GetMerchantWalletsCountOperation = GetMerchantWalletsCountOptions &
  GetMerchantWalletsCountHttpOptions

export const isValidRequestData =
  alwaysTrueGuard<GetMerchantWalletsCountOperation>()

export const isValidResponseData = (input: unknown) => isNumber(input)

export const getMerchantWalletsCount =
  internalCoinpaymentsFlow<GetMerchantWalletsCountOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams())(withQueryParams())(withBody())
