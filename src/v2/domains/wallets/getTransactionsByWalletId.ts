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
  operationId: 'getTransactionsByWalletId',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/transactions`
} as const satisfies OperationOptions

export type GetTransactionsByWalletIdOptions = typeof options

export type GetTransactionsByWalletIdHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}/transactions']['get']['parameters']['path']
  queryParams: paths['/v2/merchant/wallets/{walletIdStr}/transactions']['get']['parameters']['query']
  body: never
  response: paths['/v2/merchant/wallets/{walletIdStr}/transactions']['get']['responses']['200']['content']['application/json']
}

export type GetTransactionsByWalletIdOperation =
  GetTransactionsByWalletIdOptions & GetTransactionsByWalletIdHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetTransactionsByWalletIdOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false
  return true
}

export const getTransactionsByWalletId =
  internalCoinpaymentsFlow<GetTransactionsByWalletIdOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr'))(withQueryParams('take', 'skip'))(withBody())
