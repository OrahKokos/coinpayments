import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { isNonEmptyString, isObject, requiredPropIs } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { Transaction } from './types'
import { isValidTransaction } from './util'

export const options = {
  operationId: 'getMerchantWalletConsolidationTransactions',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletId}/consolidation-transactions/{spendId}`
} as const satisfies OperationOptions

export type GetMerchantWalletConsolidationTransactionsOptions = typeof options

export type GetMerchantWalletConsolidationTransactionsHttpOptions = {
  params: {
    walletId: string
    spendId: string
  }
  queryParams: never
  body: never
  response: Array<Transaction>
}

export type GetMerchantWalletConsolidationTransactionsOperation =
  GetMerchantWalletConsolidationTransactionsOptions &
    GetMerchantWalletConsolidationTransactionsHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetMerchantWalletConsolidationTransactionsOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'walletIdStr', isNonEmptyString) &&
  requiredPropIs(input, 'spendRequestIdStr', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetMerchantWalletConsolidationTransactionsOperation['response'] =>
  Array.isArray(response) && response.every(isValidTransaction)

export const getMerchantWalletConsolidationTransactions =
  internalCoinpaymentsFlow<GetMerchantWalletConsolidationTransactionsOperation>(
    options
  )(isValidRequestData)(isValidResponseData)(withParams('walletId', 'spendId'))(
    withQueryParams()
  )(withBody())
