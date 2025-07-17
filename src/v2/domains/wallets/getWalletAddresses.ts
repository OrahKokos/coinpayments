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
  operationId: 'getWalletAddresses',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/addresses`
} as const satisfies OperationOptions

export type GetWalletAddressesOptions = typeof options

export type GetWalletAddressesHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}/addresses']['get']['parameters']['path']
  queryParams: paths['/v2/merchant/wallets/{walletIdStr}/addresses']['get']['parameters']['query']
  body: never
  response: paths['/v2/merchant/wallets/{walletIdStr}/addresses']['get']['responses']['200']['content']['application/json']
}

export type GetWalletAddressesOperation = GetWalletAddressesOptions &
  GetWalletAddressesHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetWalletAddressesOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false
  return true
}

export const getWalletAddresses =
  internalCoinpaymentsFlow<GetWalletAddressesOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr'))(withQueryParams('take', 'skip'))(withBody())
