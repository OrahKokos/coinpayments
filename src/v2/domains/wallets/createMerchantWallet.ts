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

export const options = {
  operationId: 'createMerchantWallet',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets`
} as const satisfies OperationOptions

export type CreateMerchantWalletOptions = typeof options

export type CreateMerchantWalletHttpOptions = {
  params: never
  queryParams: never
  body: {
    currency: string
    label: string
    webhookUrl: string
    usePermanentAddresses: boolean
  }
  response: {
    walletId: string
    address: string
  }
}

export type CreateMerchantWalletOperation = CreateMerchantWalletOptions &
  CreateMerchantWalletHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<CreateMerchantWalletOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'currency', isNonEmptyString) &&
  requiredPropIs(input, 'label', isNonEmptyString) &&
  requiredPropIs(input, 'webhookUrl', isNonEmptyString) &&
  requiredPropIs(input, 'usePermanentAddresses', isBoolean)

export const isValidResponseData = (
  response: unknown
): response is CreateMerchantWalletHttpOptions['response'] =>
  isObject(response) &&
  requiredPropIs(response, 'walletId', isNonEmptyString) &&
  requiredPropIs(response, 'address', isNonEmptyString)

export const createMerchantWallet =
  internalCoinpaymentsFlow<CreateMerchantWalletOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams())(withQueryParams())(
    withBody('currency', 'label', 'webhookUrl', 'usePermanentAddresses')
  )
