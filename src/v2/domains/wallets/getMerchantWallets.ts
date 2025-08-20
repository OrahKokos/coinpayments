import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { isObject, isPositiveNumber, optionalPropIs } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { MerchantWallet } from './types'
import { isValidMerchantWallet } from './util'

export const options = {
  operationId: 'getMerchantWallets',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets`
} as const satisfies OperationOptions

export type GetMerchantWalletsOptions = typeof options

export type GetMerchantWalletsHttpOptions = {
  params: never
  queryParams: {
    take?: number
    skip?: number
  }
  body: never
  response: Array<MerchantWallet>
}

export type GetMerchantWalletsOperation = GetMerchantWalletsOptions &
  GetMerchantWalletsHttpOptions

// What happens if take > 100 ???
export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetMerchantWalletsOperation> =>
  isObject(input) &&
  optionalPropIs(input, 'take', isPositiveNumber) &&
  optionalPropIs(input, 'skip', isPositiveNumber)

export const isValidResponseData = (
  response: unknown
): response is GetMerchantWalletsHttpOptions['response'] =>
  Array.isArray(response) && response.every(isValidMerchantWallet)

export const getMerchantWallets =
  internalCoinpaymentsFlow<GetMerchantWalletsOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams())(withQueryParams('take', 'skip'))(
    withBody()
  )
