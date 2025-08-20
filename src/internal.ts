import { encode } from 'querystring'
import { Credentials, generateHeaders } from '@src/v2/auth'
import { RequestInput, SomeOperationData } from '@src/v2/types/operations'
import { ResolveAttributes } from '@src/v2/types/types'
import { ConstructCoinpaymentsRequest } from './types'
import { isEmptyObject, stringifyObjectValues, withTarget } from './utils/data'
import { createBadInputError } from './v2/error'
import {
  ProcessResult,
  processFailure,
  processSuccess
} from './v2/types/process'

export const withParams = withTarget('params')
export const withQueryParams = withTarget('queryParams')
export const withBody = withTarget('body')

export const createUrlTarget =
  <T extends string>(urlTemplate: T) =>
  <T extends Record<string, unknown>>(params: T) =>
  <T extends Record<string, unknown>>(queryParams: T): string =>
    `${Object.entries(params).reduce<string>(
      (acc, [key, value]) => acc.replace(`{${key}}`, String(value)),
      urlTemplate
    )}` +
    (isEmptyObject(queryParams)
      ? ''
      : `?${encode(stringifyObjectValues(queryParams))}`)

export const internalCoinpaymentsFlow =
  <OD extends SomeOperationData>(
    operationData: Pick<OD, 'operationId' | 'url' | 'method'>
  ) =>
  (isValidInput: (input: unknown) => input is RequestInput<OD>) =>
  (isValidResponse: (input: unknown) => input is OD['response']) =>
  (
    withParamsFunction: (input: RequestInput<OD>) => {
      params: ResolveAttributes<OD['params']>
    }
  ) =>
  (
    withQueryParamsFunction: (input: RequestInput<OD>) => {
      queryParams: ResolveAttributes<OD['queryParams']>
    }
  ) =>
  (
    withBodyFunction: (input: RequestInput<OD>) => {
      body: ResolveAttributes<OD['body']>
    }
  ) =>
  (credentials: Credentials) =>
  <
    T,
    Handler extends (
      options: ProcessResult<ConstructCoinpaymentsRequest<OD>>
    ) => T
  >(
    handlerFunction: Handler
  ) =>
  (data: RequestInput<OD> = {}): ReturnType<Handler> => {
    if (!isValidInput(data)) {
      const operationInputError = createBadInputError(operationData.operationId)

      return handlerFunction(
        processFailure(
          operationInputError('Invalid data provided for the operation', data)
        )
      ) as ReturnType<Handler>
    }

    const { params } = withParamsFunction(data)
    const { queryParams } = withQueryParamsFunction(data)
    const { body } = withBodyFunction(data)

    const { operationId, method, url } = operationData
    const { clientId } = credentials

    const operationSuccess = processSuccess({
      clientId,
      operationId,
      isValidResponse,
      httpOptions: {
        url: createUrlTarget(url)(params ?? {})(queryParams ?? {}),
        method,
        headers: generateHeaders(credentials)(operationData)(body),
        data: method === 'GET' || method === 'DELETE' ? undefined : (body ?? {})
      }
    }) as ProcessResult<ConstructCoinpaymentsRequest<OD>>

    return handlerFunction(operationSuccess) as ReturnType<Handler>
  }
