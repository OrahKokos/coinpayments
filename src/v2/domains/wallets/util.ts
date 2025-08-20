import {
  isBoolean,
  isNonEmptyString,
  isObject,
  requiredPropIs
} from '@src/utils/data'
import { Balance, MerchantWallet, MerchantWalletAddress } from './types'

export const isValidBalance = (input: unknown): input is Balance =>
  isObject(input) &&
  requiredPropIs(input, 'value', isNonEmptyString) &&
  requiredPropIs(input, 'currencyId', isNonEmptyString) &&
  requiredPropIs(input, 'currencySymbol', isNonEmptyString)

export const isValidMerchantWallet = (
  input: unknown
): input is MerchantWallet =>
  isObject(input) &&
  requiredPropIs(input, 'walletId', isNonEmptyString) &&
  requiredPropIs(input, 'walletType', isNonEmptyString) &&
  requiredPropIs(input, 'currencyId', isNonEmptyString) &&
  requiredPropIs(input, 'currencySymbol', isNonEmptyString) &&
  requiredPropIs(input, 'isActive', isBoolean) &&
  requiredPropIs(input, 'isLocked', isBoolean) &&
  requiredPropIs(input, 'label', isNonEmptyString) &&
  requiredPropIs(input, 'depositAddress', isNonEmptyString) &&
  requiredPropIs(input, 'confirmedBalance', isValidBalance) &&
  requiredPropIs(input, 'unconfirmedBalance', isValidBalance) &&
  requiredPropIs(input, 'confirmedNativeBalance', isValidBalance) &&
  requiredPropIs(input, 'unconfirmedNativeBalance', isValidBalance) &&
  requiredPropIs(input, 'canCreateAddresses', isBoolean) &&
  requiredPropIs(input, 'isVaultLocked', isBoolean) &&
  requiredPropIs(input, 'vaultLockoutEndDateTime', isNonEmptyString) &&
  requiredPropIs(input, 'hasPermanentAddresses', isBoolean) &&
  requiredPropIs(input, 'hasActiveAddress', isBoolean) &&
  requiredPropIs(input, 'clientId', isNonEmptyString)

export const isValidMerchantWalletAddress = (
  input: unknown
): input is MerchantWalletAddress =>
  isObject(input) &&
  requiredPropIs(input, 'addressId', isNonEmptyString) &&
  requiredPropIs(input, 'label', isNonEmptyString) &&
  requiredPropIs(input, 'address', isNonEmptyString) &&
  requiredPropIs(input, 'notificationUrl', isNonEmptyString) &&
  requiredPropIs(input, 'rentedTill', isNonEmptyString)
