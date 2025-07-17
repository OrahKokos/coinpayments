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
  operationId: 'createMerchantWallet',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets`
} as const satisfies OperationOptions

export type CreateMerchantWalletOptions = typeof options

export type CreateMerchantWalletHttpOptions = {
  params: never
  queryParams: never
  body: NonNullable<
    paths['/v2/merchant/wallets']['post']['requestBody']
  >['content']['application/json']
  response: paths['/v2/merchant/wallets']['post']['responses']['200']['content']['application/json']
}

export type CreateMerchantWalletOperation = CreateMerchantWalletOptions &
  CreateMerchantWalletHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<CreateMerchantWalletOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'currency') || !isNonEmptyString(data.currency))
    return false
  if (!hasOwn(data, 'label') || !isNonEmptyString(data.label)) return false

  // Optional fields validation
  if (hasOwn(data, 'webhookUrl') && !isNonEmptyString(data.webhookUrl)) {
    return false
  }
  if (
    hasOwn(data, 'usePermanentAddresses') &&
    typeof data.usePermanentAddresses !== 'boolean'
  ) {
    return false
  }

  return true
}

export const createMerchantWallet =
  internalCoinpaymentsFlow<CreateMerchantWalletOperation>(options)(
    isValidRequestData
  )(withParams())(withQueryParams())(
    withBody('currency', 'label', 'webhookUrl', 'usePermanentAddresses')
  )
