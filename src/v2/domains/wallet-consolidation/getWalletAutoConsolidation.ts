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
  operationId: 'getWalletAutoConsolidation',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/consolidation-transactions/{spendRequestIdStr}`
} as const satisfies OperationOptions

export type GetWalletAutoConsolidationOptions = typeof options

export type GetWalletAutoConsolidationHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}/consolidation-transactions/{spendRequestIdStr}']['get']['parameters']['path']
  queryParams: never
  body: never
  response: paths['/v2/merchant/wallets/{walletIdStr}/consolidation-transactions/{spendRequestIdStr}']['get']['responses']['200']['content']['application/json']
}

export type GetWalletAutoConsolidationOperation =
  GetWalletAutoConsolidationOptions & GetWalletAutoConsolidationHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetWalletAutoConsolidationOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false
  if (
    !hasOwn(data, 'spendRequestIdStr') ||
    !isNonEmptyString(data.spendRequestIdStr)
  )
    return false
  return true
}

export const getWalletAutoConsolidation =
  internalCoinpaymentsFlow<GetWalletAutoConsolidationOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr', 'spendRequestIdStr'))(withQueryParams())(
    withBody()
  )
