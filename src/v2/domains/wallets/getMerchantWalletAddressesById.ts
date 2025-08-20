import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { isNonEmptyString, isObject, requiredPropIs } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { MerchantWalletAddress } from './types'
import { isValidMerchantWalletAddress } from './util'

export const options = {
  operationId: 'getMerchantWalletAddressesById',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{id}/addresses/{aId}`
} as const satisfies OperationOptions

export type GetMerchantWalletAddressesByIdOptions = typeof options

export type GetWalletAddressesByIdHttpOptions = {
  params: {
    id: string
    aId: string
  }
  queryParams: never
  body: never
  response: MerchantWalletAddress
}

export type GetWalletAddressesByIdOperation =
  GetMerchantWalletAddressesByIdOptions & GetWalletAddressesByIdHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetWalletAddressesByIdOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'id', isNonEmptyString) &&
  requiredPropIs(input, 'aId', isNonEmptyString)

export const isValidResponseData = isValidMerchantWalletAddress

export const getMerchantWalletAddressesById =
  internalCoinpaymentsFlow<GetWalletAddressesByIdOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id', 'aId'))(withQueryParams())(withBody())
