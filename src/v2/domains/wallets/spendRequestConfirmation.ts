import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  alwaysTrueGuard,
  isNonEmptyString,
  isObject,
  requiredPropIs
} from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

export const options = {
  operationId: 'spendRequestConfirmation',
  method: 'POST',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets/{walletIdStr}/spend/confirmation`
} as const satisfies OperationOptions

export type SpendRequestConfirmationOptions = typeof options

export type SpendRequestConfirmationParams = {
  /** @description string: wallet id */
  walletIdStr: string
}

export type SpendRequestConfirmationQueryParams = never

export type SpendRequestConfirmationBody = {
  spendRequestId: string
}

export type SpendRequestConfirmationResponse = {} // 202 response has no content

export type SpendRequestConfirmationHttpOptions = {
  params: SpendRequestConfirmationParams
  queryParams: SpendRequestConfirmationQueryParams
  body: SpendRequestConfirmationBody
  response: SpendRequestConfirmationResponse
}

export type SpendRequestConfirmationOperation =
  SpendRequestConfirmationOptions & SpendRequestConfirmationHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<SpendRequestConfirmationOperation> =>
  isObject(input) &&
  requiredPropIs(input, 'walletIdStr', isNonEmptyString) &&
  requiredPropIs(input, 'spendRequestId', isNonEmptyString)

export const isValidResponseData =
  alwaysTrueGuard<SpendRequestConfirmationHttpOptions['response']>()

export const spendRequestConfirmation =
  internalCoinpaymentsFlow<SpendRequestConfirmationOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('walletIdStr'))(withQueryParams())(
    withBody('spendRequestId')
  )
