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
  operationId: 'getMerchantWalletById',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}`
} as const satisfies OperationOptions

export type GetMerchantWalletByIdOptions = typeof options

export type GetMerchantWalletByIdHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}']['get']['parameters']['path']
  queryParams: never
  body: never
  response: paths['/v2/merchant/wallets/{walletIdStr}']['get']['responses']['200']['content']['application/json']
}

export type GetMerchantWalletByIdOperation = GetMerchantWalletByIdOptions &
  GetMerchantWalletByIdHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetMerchantWalletByIdOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false
  return true
}

export const getMerchantWalletById =
  internalCoinpaymentsFlow<GetMerchantWalletByIdOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr'))(withQueryParams())(withBody())
