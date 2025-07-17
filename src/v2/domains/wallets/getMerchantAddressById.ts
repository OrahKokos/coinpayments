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
  operationId: 'getMerchantAddressById',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/addresses/{addressIdStr}`
} as const satisfies OperationOptions

export type GetMerchantAddressByIdOptions = typeof options

export type GetMerchantAddressByIdHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}/addresses/{addressIdStr}']['get']['parameters']['path']
  queryParams: never
  body: never
  response: paths['/v2/merchant/wallets/{walletIdStr}/addresses/{addressIdStr}']['get']['responses']['200']['content']['application/json']
}

export type GetMerchantAddressByIdOperation = GetMerchantAddressByIdOptions &
  GetMerchantAddressByIdHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetMerchantAddressByIdOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false
  if (!hasOwn(data, 'addressIdStr') || !isNonEmptyString(data.addressIdStr))
    return false
  return true
}

export const getMerchantAddressById =
  internalCoinpaymentsFlow<GetMerchantAddressByIdOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr', 'addressIdStr'))(withQueryParams())(withBody())
