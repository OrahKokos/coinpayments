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
  operationId: 'getTransactionByWalletId',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/transaction`
} as const satisfies OperationOptions

export type GetTransactionByWalletIdOptions = typeof options

export type GetTransactionByWalletIdHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}/transaction']['get']['parameters']['path']
  queryParams: paths['/v2/merchant/wallets/{walletIdStr}/transaction']['get']['parameters']['query']
  body: never
  response: paths['/v2/merchant/wallets/{walletIdStr}/transaction']['get']['responses']['200']['content']['application/json']
}

export type GetTransactionByWalletIdOperation =
  GetTransactionByWalletIdOptions & GetTransactionByWalletIdHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetTransactionByWalletIdOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false

  // At least one of transactionId or spendRequestId must be provided
  const hasTransactionId =
    hasOwn(data, 'transactionId') && isNonEmptyString(data.transactionId)
  const hasSpendRequestId =
    hasOwn(data, 'spendRequestId') && isNonEmptyString(data.spendRequestId)

  if (!hasTransactionId && !hasSpendRequestId) {
    return false
  }

  return true
}

export const getTransactionByWalletId =
  internalCoinpaymentsFlow<GetTransactionByWalletIdOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr'))(
    withQueryParams('transactionId', 'spendRequestId')
  )(withBody())
