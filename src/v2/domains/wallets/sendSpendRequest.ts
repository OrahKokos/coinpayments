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
  operationId: 'sendSpendRequest',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/spend/request`
} as const satisfies OperationOptions

export type SendSpendRequestOptions = typeof options

export type SendSpendRequestHttpOptions = {
  params: paths['/v2/merchant/wallets/{walletIdStr}/spend/request']['post']['parameters']['path']
  queryParams: never
  body: NonNullable<
    paths['/v2/merchant/wallets/{walletIdStr}/spend/request']['post']['requestBody']
  >['content']['application/json']
  response: paths['/v2/merchant/wallets/{walletIdStr}/spend/request']['post']['responses']['200']['content']['application/json']
}

export type SendSpendRequestOperation = SendSpendRequestOptions &
  SendSpendRequestHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<SendSpendRequestOperation> => {
  if (!isObject(data)) return false
  if (!hasOwn(data, 'walletIdStr') || !isNonEmptyString(data.walletIdStr))
    return false
  if (!hasOwn(data, 'amount') || !isNonEmptyString(data.amount)) return false
  if (!hasOwn(data, 'toAddress') || !isNonEmptyString(data.toAddress))
    return false
  if (!hasOwn(data, 'toCurrency') || !isNonEmptyString(data.toCurrency))
    return false

  return true
}

export const sendSpendRequest =
  internalCoinpaymentsFlow<SendSpendRequestOperation>(options)(
    isValidRequestData
  )(withParams('walletIdStr'))(withQueryParams())(
    withBody(
      'amount',
      'toAddress',
      'toCurrency',
      'amountCurrency',
      'memo',
      'receiverPaysFee',
      'walletToPayFeeFrom'
    )
  )
