import { Credentials } from './auth'
import {
  getCurrencyById,
  getCurrencyConversions,
  getCurrencyConversionsLimits,
  getLatestBlockNumberByCurrencyId,
  getRequiredConfirmationsForEachCurrency,
  listPlatformSupportedCurrencies
} from './domains/currencies'
import { currencyBlockchainFee } from './domains/fees'
import {
  createBuyNowButton,
  createInvoice,
  getInvoiceById,
  getInvoiceHistory,
  getInvoicePayouts,
  getListOfInvoices
} from './domains/invoices'
import { getConversionsBetweenTwoCurrencies } from './domains/rates'
import { getWalletAutoConsolidation } from './domains/wallet-consolidation'
import {
  createMerchantWallet,
  createWalletAddress,
  getMerchantAddressById,
  getMerchantWalletById,
  getMerchantWallets,
  getTransactionByWalletId,
  getTransactionsByWalletId,
  getWalletAddresses,
  sendSpendRequest,
  spendRequestConfirmation
} from './domains/wallets'
import {
  updateWalletAddressWebhook,
  updateWalletWebhook,
  walletNotificationPayload
} from './domains/webhook'

export type CoinpaymentsV2Functions =
  | typeof getCurrencyById
  | typeof getCurrencyConversions
  | typeof getCurrencyConversionsLimits
  | typeof getLatestBlockNumberByCurrencyId
  | typeof getRequiredConfirmationsForEachCurrency
  | typeof listPlatformSupportedCurrencies
  | typeof currencyBlockchainFee
  | typeof createBuyNowButton
  | typeof createInvoice
  | typeof getInvoiceById
  | typeof getInvoiceHistory
  | typeof getInvoicePayouts
  | typeof getListOfInvoices
  | typeof getConversionsBetweenTwoCurrencies
  | typeof getWalletAutoConsolidation
  | typeof createMerchantWallet
  | typeof createWalletAddress
  | typeof getMerchantAddressById
  | typeof getMerchantWalletById
  | typeof getMerchantWallets
  | typeof getTransactionByWalletId
  | typeof getTransactionsByWalletId
  | typeof getWalletAddresses
  | typeof sendSpendRequest
  | typeof spendRequestConfirmation
  | typeof updateWalletAddressWebhook
  | typeof updateWalletWebhook
  | typeof walletNotificationPayload

// Available functions for easy reference
const v2Functions = {
  // Currencies
  getCurrencyById,
  getCurrencyConversions,
  getCurrencyConversionsLimits,
  getLatestBlockNumberByCurrencyId,
  getRequiredConfirmationsForEachCurrency,
  listPlatformSupportedCurrencies,

  // Fees
  currencyBlockchainFee,

  // Invoices
  createBuyNowButton,
  createInvoice,
  getInvoiceById,
  getInvoiceHistory,
  getInvoicePayouts,
  getListOfInvoices,

  // Rates
  getConversionsBetweenTwoCurrencies,

  // Wallet Consolidation
  getWalletAutoConsolidation,

  // Wallets
  createMerchantWallet,
  createWalletAddress,
  getMerchantAddressById,
  getMerchantWalletById,
  getMerchantWallets,
  getTransactionByWalletId,
  getTransactionsByWalletId,
  getWalletAddresses,
  sendSpendRequest,
  spendRequestConfirmation,

  // Webhook
  updateWalletAddressWebhook,
  updateWalletWebhook,
  walletNotificationPayload
} as const

type AppliedFunction<T> = T extends (
  credentials: any
) => (handler: any) => infer R
  ? R
  : never

export const initClientWith =
  <const FunctionMap extends Record<string, CoinpaymentsV2Functions>>(
    functionsMap: FunctionMap
  ) =>
  (credentials: Credentials) =>
  <T, Handler extends (options: any) => T>(handler: Handler) => {
    return Object.entries(functionsMap).reduce(
      (acc, [key, func]) => {
        return {
          ...acc,
          // @ts-ignore
          [key]: func(credentials)(handler)
        }
      },
      {} as {
        [K in keyof FunctionMap]: AppliedFunction<FunctionMap[K]>
      }
    )
  }

export const initClient = initClientWith(v2Functions)
