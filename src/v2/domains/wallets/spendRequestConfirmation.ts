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
  operationId: 'spendRequestConfirmation',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/spend/confirmation`
} as const satisfies OperationOptions

export type SpendRequestConfirmationOptions = typeof options

export type SpendRequestConfirmationHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}/spend/confirmation']['post']['parameters']['path']
  queryParams: never
  body: NonNullable<
    paths['/v2/merchant/wallets/{walletIdStr}/spend/confirmation']['post']['requestBody']
  >['content']['application/json']
  response: {} // 202 response has no content
}

export type SpendRequestConfirmationOperation =
  SpendRequestConfirmationOptions & SpendRequestConfirmationHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<SpendRequestConfirmationOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false
  if (!hasOwn(data, 'spendRequestId') || !isNonEmptyString(data.spendRequestId))
    return false

  return true
}

export const spendRequestConfirmation =
  internalCoinpaymentsFlow<SpendRequestConfirmationOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr'))(withQueryParams())(withBody('spendRequestId'))
