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
  operationId: 'createWalletAddress',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/addresses`
} as const satisfies OperationOptions

export type CreateWalletAddressOptions = typeof options

export type CreateWalletAddressHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}/addresses']['post']['parameters']['path']
  queryParams: never
  body: NonNullable<
    paths['/v2/merchant/wallets/{walletIdStr}/addresses']['post']['requestBody']
  >['content']['application/json']
  response: paths['/v2/merchant/wallets/{walletIdStr}/addresses']['post']['responses']['200']['content']['application/json']
}

export type CreateWalletAddressOperation = CreateWalletAddressOptions &
  CreateWalletAddressHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<CreateWalletAddressOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false

  // Optional fields validation
  if (hasOwn(data, 'label') && !isNonEmptyString(data.label)) {
    return false
  }
  if (
    hasOwn(data, 'notificationUrl') &&
    !isNonEmptyString(data.notificationUrl)
  ) {
    return false
  }

  return true
}

export const createWalletAddress =
  internalCoinpaymentsFlow<CreateWalletAddressOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr'))(withQueryParams())(
    withBody('label', 'notificationUrl')
  )
