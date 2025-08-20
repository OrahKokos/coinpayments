import { SomeOperationData } from '../types/operations'

export const BAD_INPUT = 'BAD_INPUT' as const

export type CoinpaymentsCommonError = {
  operationId: string
  message: string
  data: unknown
}

export type CoinpaymentsBadInputError = CoinpaymentsCommonError & {
  type: typeof BAD_INPUT
}

export type CoinpaymentsError = CoinpaymentsBadInputError

export const createCoinpaymentsError =
  (type: CoinpaymentsError['type']) =>
  (operationId: SomeOperationData['operationId']) =>
  (message: string, data: unknown = undefined): CoinpaymentsError => ({
    type,
    operationId,
    message,
    data
  })

export const createBadInputError = createCoinpaymentsError(BAD_INPUT)
