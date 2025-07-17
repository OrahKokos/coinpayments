import { createHmac } from 'crypto'
import { CoinpaymentsRequestHeaders } from '../types/request'

export type Credentials = {
  clientId: string
  clientSecret: string
}

export const getIsoDate = (): string => new Date().toISOString().split('.')[0]

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
  createHmac('sha512', clientSecret).update(message).digest('base64')

export const generateHeaders =
  (credentials: Credentials) =>
  (requestOptions: { method: string; url: string }) =>
  (jsonData: string): CoinpaymentsRequestHeaders => {
    const isoDate = getIsoDate()
    const { clientId, clientSecret } = credentials
    const headers = createHeaders(clientId)(isoDate)(
      calculateSignature(clientSecret)(
        createMessageForSignature(clientId)(isoDate)(requestOptions)(jsonData)
      )
    )
    return headers
  }
