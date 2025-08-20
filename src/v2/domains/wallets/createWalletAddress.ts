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
  operationId: 'createWalletAddress',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{id}/addresses`
} as const satisfies OperationOptions

export type CreateWalletAddressOptions = typeof options

export type CreateWalletAddressHttpOptions = {
  params: {
    id: string
  }
  queryParams: never
  body: {
    label: string
    notificationUrl: string
    affiliateId: string
  }
  response: {
    addressId: string
    networkAddress: string
    rentedTill: string //date-time
  }
}

export type CreateWalletAddressOperation = CreateWalletAddressOptions &
  CreateWalletAddressHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<CreateWalletAddressOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'id', isNonEmptyString) &&
  requiredPropIs(input, 'label', isNonEmptyString) &&
  requiredPropIs(input, 'notificationUrl', isNonEmptyString) &&
  requiredPropIs(input, 'affiliateId', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is CreateWalletAddressHttpOptions['response'] =>
  isObject(response) &&
  requiredPropIs(response, 'addressId', isNonEmptyString) &&
  requiredPropIs(response, 'networkAddress', isNonEmptyString) &&
  requiredPropIs(response, 'rentedTill', isNonEmptyString)

export const createWalletAddress =
  internalCoinpaymentsFlow<CreateWalletAddressOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams())(
    withBody('label', 'notificationUrl', 'affiliateId')
  )
