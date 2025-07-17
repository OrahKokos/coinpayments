import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import { alwaysTrueGuard } from '@src/utils/data'
import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'
import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'getMerchantWallets',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/wallets`
} as const satisfies OperationOptions

export type GetMerchantWalletsOptions = typeof options

export type GetMerchantWalletsHttpOptions = {
  params: never
  queryParams: paths['/v2/merchant/wallets']['get']['parameters']['query']
  body: never
  response: paths['/v2/merchant/wallets']['get']['responses']['200']['content']['application/json']
}

export type GetMerchantWalletsOperation = GetMerchantWalletsOptions &
  GetMerchantWalletsHttpOptions

export const isValidRequestData =
  alwaysTrueGuard<RequestInput<GetMerchantWalletsOperation>>()

export const getMerchantWallets =
  internalCoinpaymentsFlow<GetMerchantWalletsOperation>(options)(
    isValidRequestData
  )(withParams())(withQueryParams('take', 'skip'))(withBody())
