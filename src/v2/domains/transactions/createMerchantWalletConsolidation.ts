import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { isNonEmptyString, isObject, requiredPropIs } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { WalletConsolidation } from './types'
import { isValidWalletConsolidation } from './util'

export const options = {
  operationId: 'createMerchantWalletConsolidation',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{from}/consolidation/{to}`
} as const satisfies OperationOptions

export type CreateMerchantWalletConsolidationOptions = typeof options

export type CreateMerchantWalletConsolidationHttpOptions = {
  params: {
    from: string
    to: string
  }
  queryParams: {
    addressIds: string
  }
  body: never
  response: WalletConsolidation
}

export type CreateMerchantWalletConsolidationOperation =
  CreateMerchantWalletConsolidationOptions &
    CreateMerchantWalletConsolidationHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<CreateMerchantWalletConsolidationOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'from', isNonEmptyString) &&
  requiredPropIs(input, 'to', isNonEmptyString) &&
  requiredPropIs(input, 'addressIds', isNonEmptyString)

export const isValidResponseData = isValidWalletConsolidation

export const createMerchantWalletConsolidation =
  internalCoinpaymentsFlow<CreateMerchantWalletConsolidationOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('from', 'to'))(
    withQueryParams('addressIds')
  )(withBody())
