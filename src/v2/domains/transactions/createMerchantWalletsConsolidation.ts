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
  operationId: 'createMerchantWalletsConsolidation',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/consolidation/{id}`
} as const satisfies OperationOptions

export type CreateMerchantWalletsConsolidationOptions = typeof options

export type CreateMerchantWalletsConsolidationHttpOptions = {
  params: {
    id: string
  }
  body: {
    wallets: Array<{
      walletId: string
      addresses: string[]
    }>
  }
  response: WalletConsolidation
}

export type CreateMerchantWalletsConsolidationOperation =
  CreateMerchantWalletsConsolidationOptions &
    CreateMerchantWalletsConsolidationHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<CreateMerchantWalletsConsolidationOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'id', isNonEmptyString) &&
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

export const isValidResponseData = isValidWalletConsolidation

export const createMerchantWalletsConsolidation =
  internalCoinpaymentsFlow<CreateMerchantWalletsConsolidationOperation>(
    options
  )(isValidRequestData)(isValidResponseData)(withParams('id'))(
    withQueryParams()
  )(withBody())
