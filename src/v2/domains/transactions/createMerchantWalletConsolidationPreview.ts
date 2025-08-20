import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isArrayOfExactStrings,
  isNonEmptyString,
  isObject,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { WalletConsolidation } from './types'
import { isValidWalletConsolidation } from './util'

export const options = {
  operationId: 'createMerchantWalletConsolidationPreview',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/consolidation-preview`
} as const satisfies OperationOptions

export type CreateMerchantWalletConsolidationPreviewOptions = typeof options

export type CreateMerchantWalletConsolidationPreviewHttpOptions = {
  params: never
  queryParams: never
  body: {
    wallets: Array<{
      walletId: string
      addresses: string[]
    }>
  }
  response: Array<WalletConsolidation>
}

export type CreateMerchantWalletConsolidationPreviewOperation =
  CreateMerchantWalletConsolidationPreviewOptions &
    CreateMerchantWalletConsolidationPreviewHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<CreateMerchantWalletConsolidationPreviewOperation> =>
  isObject(input) &&
  requiredPropIs(
    input,
    'wallets',
    (wallets) =>
      Array.isArray(wallets) &&
      wallets.every(
        (item) =>
          isObject(item) &&
          requiredPropIs(item, 'walletId', isNonEmptyString) &&
          requiredPropIs(item, 'addresses', isArrayOfExactStrings)
      )
  )

export const isValidResponseData = (
  input: unknown
): input is Array<WalletConsolidation> =>
  Array.isArray(input) && input.every(isValidWalletConsolidation)

export const createMerchantWalletConsolidationPreview =
  internalCoinpaymentsFlow<CreateMerchantWalletConsolidationPreviewOperation>(
    options
  )(isValidRequestData)(isValidResponseData)(withParams())(withQueryParams())(
    withBody('wallets')
  )
