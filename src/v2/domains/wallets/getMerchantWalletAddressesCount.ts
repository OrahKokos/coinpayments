import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isNonEmptyString,
  isNumber,
  isObject,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

export const options = {
  operationId: 'getMerchantWalletAddressesCount',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{id}/addresses/count`
} as const satisfies OperationOptions

export type GetMerchantWalletAddressesCountOptions = typeof options

export type GetMerchantWalletAddressesCountHttpOptions = {
  params: {
    id: string
  }
  queryParams: never
  body: never
  response: number
}

export type GetMerchantWalletAddressesCountOperation =
  GetMerchantWalletAddressesCountOptions &
    GetMerchantWalletAddressesCountHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetMerchantWalletAddressesCountOperation> =>
  isObject(input) && requiredPropIs(input, 'id', isNonEmptyString)

export const isValidResponseData = (input: unknown): input is number =>
  isNumber(input)

export const getMerchantWalletsAddressesCount =
  internalCoinpaymentsFlow<GetMerchantWalletAddressesCountOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams())(withBody())
