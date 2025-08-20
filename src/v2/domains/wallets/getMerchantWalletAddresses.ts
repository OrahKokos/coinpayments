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
import { MerchantWalletAddress } from './types'
import { isValidMerchantWalletAddress } from './util'

export const options = {
  operationId: 'getMerchantWalletAddresses',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{id}/addresses`
} as const satisfies OperationOptions

export type GetMerchantWalletAddressesOptions = typeof options

export type GetWalletAddressesHttpOptions = {
  params: {
    id: string
  }
  queryParams: {
    take?: string
    skip?: string
  }
  body: never
  response: Array<MerchantWalletAddress>
}

export type GetWalletAddressesOperation = GetMerchantWalletAddressesOptions &
  GetWalletAddressesHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetWalletAddressesOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'id', isNonEmptyString) &&
  optionalPropIs(input, 'take', isNonEmptyString) &&
  optionalPropIs(input, 'skip', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetWalletAddressesHttpOptions['response'] =>
  Array.isArray(response) && response.every(isValidMerchantWalletAddress)

export const getMerchantWalletAddresses =
  internalCoinpaymentsFlow<GetWalletAddressesOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams('take', 'skip'))(
    withBody()
  )
