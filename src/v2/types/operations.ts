import { COINPAYMENTS_API_URL } from '../constants'
import { ResolveAttributes } from './types'

export type OperationOptions = {
  operationId: string
  url: `${typeof COINPAYMENTS_API_URL}/v2/${string}`
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

export type OperationDataCommon = OperationOptions & {
  params?: Record<string, unknown>
  queryParams?: Record<string, unknown>
  response?: Record<string, unknown> | Array<unknown> | unknown
}

export type OperationDataWithoutBody = OperationDataCommon & {
  method: 'GET' | 'DELETE'
  body: never
}

export type OperationDataWithBody = OperationDataCommon & {
  method: 'POST' | 'PUT'
  body: Record<string, unknown>
}

export type SomeOperationData = OperationDataWithoutBody | OperationDataWithBody

export type CreateOperationData<T extends OperationOptions> = {
  [OperationId in T['operationId']]: T
}

export type RequestInput<T extends SomeOperationData> = ResolveAttributes<
  T['params']
> &
  ResolveAttributes<T['queryParams']> &
  ResolveAttributes<T['body']>
