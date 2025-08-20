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

export const options = {
  operationId: 'getMerchantAddressById',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/addresses/{addressIdStr}`
} as const satisfies OperationOptions

export type GetMerchantAddressByIdOptions = typeof options

export type GetMerchantAddressByIdParams = {
  /** @description string: wallet id */
  walletIdStr: string
  /** @description string: address id */
  addressIdStr: string
}

export type GetMerchantAddressByIdQueryParams = never

export type GetMerchantAddressByIdBody = never

export type GetMerchantAddressByIdResponse = {
  id?: string
  addressId?: string
  walletId?: string
  address?: string
  label?: string
  balance?: string
  balanceUsd?: string
}

export type GetMerchantAddressByIdHttpOptions = {
  params: GetMerchantAddressByIdParams
  queryParams: GetMerchantAddressByIdQueryParams
  body: GetMerchantAddressByIdBody
  response: GetMerchantAddressByIdResponse
}

export type GetMerchantAddressByIdOperation = GetMerchantAddressByIdOptions &
  GetMerchantAddressByIdHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetMerchantAddressByIdOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'walletIdStr', isNonEmptyString) &&
  requiredPropIs(input, 'addressIdStr', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetMerchantAddressByIdHttpOptions['response'] =>
  isObject(response) &&
  optionalPropIs(response, 'id', isNonEmptyString) &&
  optionalPropIs(response, 'addressId', isNonEmptyString) &&
  optionalPropIs(response, 'walletId', isNonEmptyString) &&
  optionalPropIs(response, 'address', isNonEmptyString) &&
  optionalPropIs(response, 'label', isNonEmptyString) &&
  optionalPropIs(response, 'balance', isNonEmptyString) &&
  optionalPropIs(response, 'balanceUsd', isNonEmptyString)

export const getMerchantAddressById =
  internalCoinpaymentsFlow<GetMerchantAddressByIdOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('walletIdStr', 'addressIdStr'))(
    withQueryParams()
  )(withBody())
