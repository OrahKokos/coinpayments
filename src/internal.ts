import { Credentials, generateHeaders } from '@src/v2/auth'
import { RequestInput, SomeOperationData } from '@src/v2/types/operations'
import { ResolveAttributes } from '@src/v2/types/types'
import { ConstructCoinpaymentsRequest } from './types'
import { isEmptyObject, stringifyObjectValues, withTarget } from './utils/data'

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
    (isEmptyObject(queryParams) ? '' : `?${stringifyObjectValues(queryParams)}`)

export const internalCoinpaymentsFlow =
  <OD extends SomeOperationData>(
    operationData: Pick<OD, 'operationId' | 'url' | 'method'>
  ) =>
  (validationFunction: (input: unknown) => input is RequestInput<OD>) =>
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
  <T, Handler extends (options: ConstructCoinpaymentsRequest<OD>) => T>(
    handlerFunction: Handler
  ) =>
  (data: RequestInput<OD>): ReturnType<Handler> => {
    const isValid = validationFunction(data)
    // process request fail
    if (!isValid) {
      throw new Error('Invalid data provided for the operation')
    }
    const params = withParamsFunction(data)
    const queryParams = withQueryParamsFunction(data)
    const body = withBodyFunction(data)

    const { operationId, method, url } = operationData
    const { clientId } = credentials

    return handlerFunction({
      metadata: {
        clientId,
        operationId
      },
      httpOptions: {
        url: createUrlTarget(url)(params)(queryParams),
        method,
        headers: generateHeaders(credentials)(operationData)(
          body.body ? JSON.stringify(body.body) : ''
        ),
        body: body.body ?? undefined
      }
      // solve this later
    } as ConstructCoinpaymentsRequest<OD>) as ReturnType<Handler>
  }
