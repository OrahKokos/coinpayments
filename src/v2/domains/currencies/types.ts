export type Currency = {
  id: string
  type: 'crypto' | 'token' | 'fiat'
  symbol: string
  name: string
  logo: {
    imageUrl: string
    vectorUrl: string
  }
  decimalPlaces: number
  rank: number
  status: 'active' | 'underMaintenance' | 'deleted'
  capabilities: Array<
    'payments' | 'singleSigAccounts' | 'pooledAccounts' | 'utxo'
  >
  urls: {
    website: string
    explorer: string
  }
  requiredConfirmations: number
  isEnabledForPayment: boolean
}
