import { CoinpaymentsError } from '../error'

export type ProcessFailure = {
  success: false
  error: CoinpaymentsError
}

export type ProcessSuccess<T> = {
  success: true
  data: T
}

export type ProcessResult<T> = ProcessSuccess<T> | ProcessFailure

export const processSuccess = <T>(data: T): ProcessSuccess<T> => ({
  success: true,
  data
})

export const processFailure = (error: CoinpaymentsError): ProcessFailure => ({
  success: false,
  error
})
