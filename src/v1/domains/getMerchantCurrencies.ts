import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { ConstructCoinpaymentsRequest } from '@src/types'
import { isObject, isOptionalNumber } from '@src/utils/data'
import { Credentials } from '../../v2/auth'
import { COINPAYMENTS_API_URL_V1 } from '../../v2/constants'
import { OperationOptions, RequestInput } from '../../v2/types/operations'

export const options = {
  operationId: 'getMerchantCurrencies',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL_V1}/merchant/currencies`
} as const satisfies OperationOptions

export type GetMerchantCurrenciesOptions = typeof options

export type GetMerchantCurrenciesHttpOptions = {
  params: never
  queryParams: {
    take?: number
    skip?: number
  }
  body: never
  response: {
    items: Array<{
      currency: {
        id: string
        type: string
        symbol: string
        name: string
        logo: {
          url: string
          width: number
          height: number
        }
        decimalPlaces: number
        rank: number
        status: string
        capabilities: Array<string>
        urls: {
          blockExplorerUrl: string
          logoUrl: string
          websiteUrl: string
          apiUrl: string
        }
        requiredConfirmations: number
        isEnabledForPayment: boolean
      }
      payoutFrequency:
        | 'normal'
        | 'asSoonAsPossible'
        | 'hourly'
        | 'nightly'
        | 'weekly'
      order: number
      discountPercent: number
      markupPercent: number
      payoutConfigurations: Array<{
        currencyId: string | null
        address: string | null
        walletId: string | null
      }>
      switcherStatus: 'enabled' | 'disabled'
    }>
    paging: {
      cursor: {
        before: string
        after: string
      }
      limit: number
      first: string
      next: string
      previous: string
      last: string
    }
  }
}

export type GetMerchantCurrenciesOperation = GetMerchantCurrenciesOptions &
  GetMerchantCurrenciesHttpOptions

export const isValidRequestData = (
  data: unknown
): data is RequestInput<GetMerchantCurrenciesOperation> => {
  if (!isObject(data)) return false
  if (!isOptionalNumber(data.take)) return false
  if (!isOptionalNumber(data.skip)) return false
  return true
}

const MAX_TAKE = 100
const withParsedQueryParams = (
  data: RequestInput<GetMerchantCurrenciesOperation>
) => {
  const parsedData = {
    ...data,
    take: data.take ? Math.min(data.take, MAX_TAKE) : undefined
  }
  return withQueryParams('take', 'skip')(parsedData)
}

export const _getMerchantCurrencies =
  internalCoinpaymentsFlow<GetMerchantCurrenciesOperation>(options)(
    isValidRequestData
  )(withParams())(withParsedQueryParams)(withBody())

export const getMerchantCurrencies =
  (credentials: Credentials) =>
  <
    T,
    Handler extends (
      options: ConstructCoinpaymentsRequest<GetMerchantCurrenciesOperation>
    ) => T
  >(
    handleFunction: Handler
  ) =>
  (data: RequestInput<GetMerchantCurrenciesOperation> = {}) =>
    _getMerchantCurrencies(credentials)(handleFunction)(data)
