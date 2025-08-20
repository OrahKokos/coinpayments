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
  operationId: 'getMerchantWalletsTransactions',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{id}/transactions`
} as const satisfies OperationOptions

export type GetMerchantWalletsTransactionsOptions = typeof options

export type GetMerchantWalletsTransactionsHttpOptions = {
  params: {
    id: string
  }
  queryParams: {
    take?: string
    skip?: string
  }
  body: never
  response: Array<Transaction>
}

export type GetTransactionsByWalletIdOperation =
  GetMerchantWalletsTransactionsOptions &
    GetMerchantWalletsTransactionsHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetTransactionsByWalletIdOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'id', isNonEmptyString) &&
  optionalPropIs(input, 'take', isNonEmptyString) &&
  optionalPropIs(input, 'skip', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetTransactionsByWalletIdOperation['response'] =>
  Array.isArray(response) && response.every(isValidTransaction)

export const getTransactionsByWalletId =
  internalCoinpaymentsFlow<GetTransactionsByWalletIdOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams('take', 'skip'))(
    withBody()
  )
