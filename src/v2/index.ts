import { ConstructCoinpaymentsRequest } from '@src/types'
import {
  ListPlatformSupportedCurrenciesOperation,
  ListPlatformSupportedCurrenciesOptions
} from '../deprecated/listPlatformSupportedCurrencies'
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
import { SomeCoinpaymentsRequestOptions } from './types/types'

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

export type V2Functions = typeof v2Functions
export type V2FunctionKeys = keyof V2Functions

export const initWithCredentials =
  <const T extends Partial<V2Functions>>(functions: T) =>
  (credentials: Credentials) => {
    type InitWithCredentialsResult = {
      [K in keyof T]: T[K] extends (credentials: Credentials) => infer R
        ? R
        : never
    }
    return Object.entries(functions).reduce<InitWithCredentialsResult>(
      (acc, [key, func]) => {
        // @ts-ignore
        acc[key as keyof T] = func(credentials)
        return acc
      },
      {} as InitWithCredentialsResult
    )
  }

// export const initClientWith =
//   <const T extends Partial<V2Functions>>(functions: T) =>
//   (credentials: Credentials) =>
//   (handlers: OnOperationHandlers) => {
//     type AllCurriedFunctions = {
//       [K in keyof T]: (
//         options: ExtractOptionsType<X2ReturnType<T[K]>>
//       ) => ReturnType<Handler>
//     }
//     // TS limitation
//     return Object.entries(functions).reduce<AllCurriedFunctions>(
//       (acc, [key, func]) => {
//         // @ts-ignore
//         acc[key as keyof T] = func(credentials)(handler)
//         return acc
//       },
//       {} as AllCurriedFunctions
//     )
//   }

// export const initClient = initClientWith(v2Functions)
