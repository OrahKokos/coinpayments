export type Balance = {
  value: string
  currencyId: string
  currencySymbol: string
}

export type MerchantWallet = {
  walletId: string
  walletType: 'singleSigCryptoWallet'
  currencyId: string
  currencySymbol: string
  isActive: boolean
  isLocked: boolean
  label: string
  depositAddress: string
  confirmedBalance: Balance
  unconfirmedBalance: Balance
  confirmedNativeBalance: Balance
  unconfirmedNativeBalance: Balance
  canCreateAddresses: boolean
  isVaultLocked: boolean
  vaultLockoutEndDateTime: string // date-time
  hasPermanentAddresses: boolean
  hasActiveAddress: boolean
  clientId: string
}

export type MerchantWalletAddress = {
  addressId: string
  label: string
  address: string
  notificationUrl: string
  rentedTill: string
}
