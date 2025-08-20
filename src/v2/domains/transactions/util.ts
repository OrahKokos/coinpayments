import { isNonEmptyString, isObject, requiredPropIs } from '@src/utils/data'
import { Transaction, WalletConsolidation } from './types'

export const isValidTransaction = (input: unknown): input is Transaction =>
  isObject(input) &&
  requiredPropIs(input, 'id', isNonEmptyString) &&
  requiredPropIs(input, 'dateCreated', isNonEmptyString) &&
  requiredPropIs(input, 'dateCompleted', isNonEmptyString) &&
  requiredPropIs(input, 'fromOwnerId', isNonEmptyString) &&
  requiredPropIs(input, 'fromWalletId', isNonEmptyString) &&
  requiredPropIs(input, 'toWalletId', isNonEmptyString) &&
  requiredPropIs(input, 'spendRequestId', isNonEmptyString) &&
  requiredPropIs(input, 'fromCurrencyId', isNonEmptyString) &&
  requiredPropIs(input, 'fromCurrencySymbol', isNonEmptyString) &&
  requiredPropIs(input, 'toCurrencyId', isNonEmptyString) &&
  requiredPropIs(input, 'toCurrencySymbol', isNonEmptyString) &&
  requiredPropIs(input, 'fromAmount', isNonEmptyString) &&
  requiredPropIs(input, 'toAmount', isNonEmptyString) &&
  requiredPropIs(input, 'coinpaymentsFee', isNonEmptyString) &&
  requiredPropIs(input, 'coinPaymentsFeeCurrency', isNonEmptyString) &&
  requiredPropIs(input, 'coinPaymentsFeeCurrencySymbol', isNonEmptyString) &&
  requiredPropIs(input, 'blockchainFee', isNonEmptyString) &&
  requiredPropIs(input, 'blockchainFeeCurrency', isNonEmptyString) &&
  requiredPropIs(input, 'blockchainFeeCurrencySymbol', isNonEmptyString) &&
  requiredPropIs(input, 'transactionStatus', isNonEmptyString) &&
  requiredPropIs(input, 'transactionType', isNonEmptyString) &&
  requiredPropIs(input, 'memo', isNonEmptyString) &&
  requiredPropIs(input, 'fromAddress', isNonEmptyString) &&
  requiredPropIs(input, 'toAddress', isNonEmptyString) &&
  requiredPropIs(input, 'txHash', isNonEmptyString) &&
  requiredPropIs(input, 'outputIndex', isNonEmptyString) &&
  requiredPropIs(input, 'blockNumberTxAppearedAt', isNonEmptyString) &&
  requiredPropIs(input, 'supportTransactionId', isNonEmptyString) &&
  requiredPropIs(input, 'confirmations', isNonEmptyString) &&
  requiredPropIs(input, 'requiredConfirmations', isNonEmptyString) &&
  requiredPropIs(input, 'fromAmountNative', isNonEmptyString) &&
  requiredPropIs(input, 'toAmountNative', isNonEmptyString) &&
  requiredPropIs(input, 'coinpaymentsFeeNative', isNonEmptyString) &&
  requiredPropIs(input, 'blockchainFeeNative', isNonEmptyString) &&
  requiredPropIs(input, 'nativeCurrency', isNonEmptyString) &&
  requiredPropIs(input, 'nativeCurrencySymbol', isNonEmptyString) &&
  requiredPropIs(input, 'isInvoicePaymentSend', isNonEmptyString) &&
  requiredPropIs(input, 'paymentType', isNonEmptyString) &&
  requiredPropIs(input, 'convertedTxHash', isNonEmptyString)

export const isValidWalletConsolidation = (
  input: unknown
): input is WalletConsolidation =>
  isObject(input) &&
  requiredPropIs(input, 'newReceivedInternal', isNonEmptyString) &&
  requiredPropIs(input, 'newReceivedExternal', isNonEmptyString) &&
  requiredPropIs(input, 'activationFee', isNonEmptyString) &&
  requiredPropIs(input, 'transferFee', isNonEmptyString) &&
  requiredPropIs(input, 'totalFee', isNonEmptyString) &&
  requiredPropIs(input, 'available', isNonEmptyString) &&
  requiredPropIs(input, 'addresses', Array.isArray) &&
  input.addresses.every(
    (address) =>
      isObject(address) &&
      requiredPropIs(address, 'newReceivedInternal', isNonEmptyString) &&
      requiredPropIs(address, 'newReceivedExternal', isNonEmptyString) &&
      requiredPropIs(address, 'activationFee', isNonEmptyString) &&
      requiredPropIs(address, 'transferFee', isNonEmptyString) &&
      requiredPropIs(address, 'totalFee', isNonEmptyString) &&
      requiredPropIs(address, 'available', isNonEmptyString) &&
      requiredPropIs(address, 'address', isNonEmptyString) &&
      requiredPropIs(address, 'addressId', isNonEmptyString) &&
      requiredPropIs(address, 'walletId', isNonEmptyString)
  )
