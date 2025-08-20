import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { isNonEmptyString, isObject, requiredPropIs } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { CreateMerchantWalletConsolidationOperation } from './createMerchantWalletConsolidation'
import { WalletConsolidation } from './types'
import { isValidWalletConsolidation } from './util'

export const options = {
  operationId: 'getMerchantWalletConsolidation',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{id}/consolidation`
} as const satisfies OperationOptions

export type GetMerchantWalletConsolidationOptions = typeof options

export type GetMerchantWalletConsolidationHttpOptions = {
  params: {
    id: string
  }
  queryParams: {
    addressIds: string
  }
  body: never
  response: WalletConsolidation
}

export type GetMerchantWalletConsolidationOperation =
  GetMerchantWalletConsolidationOptions &
    GetMerchantWalletConsolidationHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetMerchantWalletConsolidationOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'id', isNonEmptyString) &&
  requiredPropIs(input, 'addressIds', isNonEmptyString)

export const isValidResponseData = isValidWalletConsolidation

export const createMerchantWalletConsolidation =
  internalCoinpaymentsFlow<GetMerchantWalletConsolidationOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams('addressIds'))(
    withBody()
  )
