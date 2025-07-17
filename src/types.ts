import { SomeOperationData } from './v2/types/operations'

export type CoinpaymentsRequestWithoutBody = {
  metadata: {
    clientId: string
    operationId: string
  }
  httpOptions: {
    url: string
    method: 'GET' | 'DELETE'
    headers: {
      'X-CoinPayments-Client': string
      'X-CoinPayments-Timestamp': string
      'X-CoinPayments-Signature': string
    }
  }
}

export type CoinpaymentsRequestWithBody = CoinpaymentsRequestWithoutBody & {
  httpOptions: {
    url: string
    method: 'POST' | 'PUT'
    headers: {
      'X-CoinPayments-Client': string
      'X-CoinPayments-Timestamp': string
      'X-CoinPayments-Signature': string
    }
    body: Record<string, unknown>
  }
}

export type CoinpaymentsRequest =
  | CoinpaymentsRequestWithoutBody
  | CoinpaymentsRequestWithBody

export type ConstructCoinpaymentsRequestMetadata<OD extends SomeOperationData> =
  {
    metadata: {
      clientId: string
      operationId: OD['operationId']
    }
  }
export type ConstructCoinpaymentsRequestHttpOptions<
  OD extends SomeOperationData
> = {
  httpOptions: {
    url: OD['url']
    method: OD['method']
    headers: {
      'X-CoinPayments-Client': string
      'X-CoinPayments-Timestamp': string
      'X-CoinPayments-Signature': string
    }
    body: OD['body'] extends never ? never : OD['body']
  }
}

export type ConstructCoinpaymentsRequest<OD extends SomeOperationData> =
  ConstructCoinpaymentsRequestMetadata<OD> &
    ConstructCoinpaymentsRequestHttpOptions<OD>
