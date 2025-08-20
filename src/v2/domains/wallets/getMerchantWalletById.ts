import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isBoolean,
  isNonEmptyString,
  isObject,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { MerchantWallet } from './types'
import { isValidMerchantWallet } from './util'

export const options = {
  operationId: 'getMerchantWalletById',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{id}`
} as const satisfies OperationOptions

export type GetMerchantWalletByIdOptions = typeof options

export type GetMerchantWalletByIdHttpOptions = {
  params: {
    id: string
  }
  queryParams: never
  body: never
  response: MerchantWallet
}

export type GetMerchantWalletByIdOperation = GetMerchantWalletByIdOptions &
  GetMerchantWalletByIdHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetMerchantWalletByIdOperation> =>
  isObject(input) && requiredPropIs(input, 'id', isNonEmptyString)

export const isValidResponseData = isValidMerchantWallet

export const getMerchantWalletById =
  internalCoinpaymentsFlow<GetMerchantWalletByIdOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams())(withBody())
