import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isNonEmptyString,
  isObject,
  optionalPropIs,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { Transaction } from './types'
import { isValidTransaction } from './util'

export const options = {
  operationId: 'getMerchantWalletsTransaction',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{id}/transaction`
} as const satisfies OperationOptions

export type GetMerchantWalletsTransactionOptions = typeof options

export type GetMerchantWalletsTransactionHttpOptions = {
  params: {
    id: string
  }
  queryParams: {
    transactionId?: string
    spendRequestId?: string
  }
  body: never
  response: Transaction
}

export type GetMerchantWalletsTransactionOperation =
  GetMerchantWalletsTransactionOptions &
    GetMerchantWalletsTransactionHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetMerchantWalletsTransactionOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'id', isNonEmptyString) &&
  optionalPropIs(input, 'transactionId', isNonEmptyString) &&
  optionalPropIs(input, 'spendRequestId', isNonEmptyString)

export const isValidResponseData = isValidTransaction

export const getMerchantWalletsTransaction =
  internalCoinpaymentsFlow<GetMerchantWalletsTransactionOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(
    withQueryParams('transactionId', 'spendRequestId')
  )(withBody())
