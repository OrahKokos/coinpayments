import { createHmac } from 'crypto'
import { getIsoDate, isEmptyObject } from '@src/utils/data'
import { CoinpaymentsRequestHeaders } from '../types/request'

export type Credentials = {
  clientId: string
  clientSecret: string
}

export const createHeaders =
  (clientId: string) =>
  (isoDate: string) =>
  (signature: string): CoinpaymentsRequestHeaders => {
    return {
      'X-CoinPayments-Client': clientId,
      'X-CoinPayments-Timestamp': isoDate,
      'X-CoinPayments-Signature': signature
    }
  }

export const createMessageForSignature =
  (clientId: string) =>
  (isoDate: string) =>
  (requestOptions: { method: string; url: string }) =>
  (jsonData: string): string =>
    `\ufeff${requestOptions.method}${requestOptions.url}${clientId}${isoDate}${jsonData}`

export const calculateSignature = (clientSecret: string) => (message: string) =>
  createHmac('sha256', clientSecret).update(message).digest('base64')

export const resolveJsonData = (someData?: Record<string, unknown>) =>
  isEmptyObject(someData) || someData === undefined
    ? ''
    : JSON.stringify(someData)

export const generateHeaders =
  (credentials: Credentials) =>
  (requestOptions: { method: string; url: string }) =>
  (
    requestData: Record<string, unknown> | undefined
  ): CoinpaymentsRequestHeaders => {
    const isoDate = getIsoDate()
    const { clientId, clientSecret } = credentials

    return createHeaders(clientId)(isoDate)(
      calculateSignature(clientSecret)(
        createMessageForSignature(clientId)(isoDate)(requestOptions)(
          resolveJsonData(requestData)
        )
      )
    )
  }
