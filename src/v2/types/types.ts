import { ConstructCoinpaymentsRequest } from '@src/types'
import { ListPlatformSupportedCurrenciesOperation } from '../../deprecated/listPlatformSupportedCurrencies'
import { GetRequiredConfirmationsForEachCurrencyOperation } from '../domains/currencies/getCurrenciesRequiredConfirmations'
// Currencies
import { GetCurrencyByIdOperation } from '../domains/currencies/getCurrencyById'
import { GetCurrencyConversionsLimitsOperation } from '../domains/currencies/getCurrencyConversionLimits'
import { GetCurrencyConversionsOperation } from '../domains/currencies/getCurrencyConversions'
import { GetLatestBlockNumberByCurrencyIdOperation } from '../domains/currencies/getCurrencyLatestBlockNumberById'
// Fees
import { CurrencyBlockchainFeeOperation } from '../domains/fees/getCurrencyBlockchainFee'
// Invoices
import { CreateBuyNowButtonOperation } from '../domains/invoices/createBuyNowButton'
import { CreateInvoiceOperation } from '../domains/invoices/createInvoice'
import { GetInvoiceByIdOperation } from '../domains/invoices/getInvoiceById'
import { GetInvoiceHistoryOperation } from '../domains/invoices/getInvoiceHistory'
import { GetInvoicePayoutsOperation } from '../domains/invoices/getInvoicePayouts'
import { GetListOfInvoicesOperation } from '../domains/invoices/getListOfInvoices'
// Rates
import { GetRatesOperation } from '../domains/rates/getRates'
// Wallet Consolidation
import { GetWalletAutoConsolidationOperation } from '../domains/transactions/getMerchantWalletConsolidationTransactions'
// Wallets
import { CreateMerchantWalletOperation } from '../domains/wallets/createMerchantWallet'
import { CreateWalletAddressOperation } from '../domains/wallets/createWalletAddress'
import { GetMerchantAddressByIdOperation } from '../domains/wallets/getMerchantAddressById'
import { GetWalletAddressesOperation } from '../domains/wallets/getMerchantWalletAddresses'
import { GetMerchantWalletByIdOperation } from '../domains/wallets/getMerchantWalletById'
import { GetMerchantWalletsOperation } from '../domains/wallets/getMerchantWallets'
import { GetTransactionByWalletIdOperation } from '../domains/wallets/getTransactionByWalletId'
import { SendSpendRequestOperation } from '../domains/wallets/sendSpendRequest'
import { SpendRequestConfirmationOperation } from '../domains/wallets/spendRequestConfirmation'
// Webhook
import { UpdateWalletAddressWebhookOperation } from '../domains/webhook/updateWalletAddressWebhook'
import { UpdateWalletWebhookOperation } from '../domains/webhook/updateWalletWebhook'
import { WalletNotificationPayloadOperation } from '../domains/webhook/walletNotificationPayload'

export type ResolveAttributes<T> = [T] extends [never] ? {} : T

export type SomeCoinpaymentsOperationData =
  | GetCurrencyByIdOperation
  | GetCurrencyConversionsOperation
  | GetCurrencyConversionsLimitsOperation
  | GetLatestBlockNumberByCurrencyIdOperation
  | GetRequiredConfirmationsForEachCurrencyOperation
  | ListPlatformSupportedCurrenciesOperation
  | CurrencyBlockchainFeeOperation
  | CreateBuyNowButtonOperation
  | CreateInvoiceOperation
  | GetInvoiceByIdOperation
  | GetInvoiceHistoryOperation
  | GetInvoicePayoutsOperation
  | GetListOfInvoicesOperation
  | GetRatesOperation
  | GetWalletAutoConsolidationOperation
  | CreateMerchantWalletOperation
  | CreateWalletAddressOperation
  | GetMerchantAddressByIdOperation
  | GetMerchantWalletByIdOperation
  | GetMerchantWalletsOperation
  | GetTransactionByWalletIdOperation
  | GetWalletAddressesOperation
  | SendSpendRequestOperation
  | SpendRequestConfirmationOperation
  | UpdateWalletAddressWebhookOperation
  | UpdateWalletWebhookOperation
  | WalletNotificationPayloadOperation

export type SomeCoinpaymentsRequestOptions =
  // Currencies
  | ConstructCoinpaymentsRequest<GetCurrencyByIdOperation>
  | ConstructCoinpaymentsRequest<GetCurrencyConversionsOperation>
  | ConstructCoinpaymentsRequest<GetCurrencyConversionsLimitsOperation>
  | ConstructCoinpaymentsRequest<GetLatestBlockNumberByCurrencyIdOperation>
  | ConstructCoinpaymentsRequest<GetRequiredConfirmationsForEachCurrencyOperation>
  | ConstructCoinpaymentsRequest<ListPlatformSupportedCurrenciesOperation>
  // Fees
  | ConstructCoinpaymentsRequest<CurrencyBlockchainFeeOperation>
  // Invoices
  | ConstructCoinpaymentsRequest<CreateBuyNowButtonOperation>
  | ConstructCoinpaymentsRequest<CreateInvoiceOperation>
  | ConstructCoinpaymentsRequest<GetInvoiceByIdOperation>
  | ConstructCoinpaymentsRequest<GetInvoiceHistoryOperation>
  | ConstructCoinpaymentsRequest<GetInvoicePayoutsOperation>
  | ConstructCoinpaymentsRequest<GetListOfInvoicesOperation>
  // Rates
  | ConstructCoinpaymentsRequest<GetConversionsBetweenTwoCurrenciesOperation>
  // Wallet Consolidation
  | ConstructCoinpaymentsRequest<GetWalletAutoConsolidationOperation>
  // Wallets
  | ConstructCoinpaymentsRequest<CreateMerchantWalletOperation>
  | ConstructCoinpaymentsRequest<CreateWalletAddressOperation>
  | ConstructCoinpaymentsRequest<GetMerchantAddressByIdOperation>
  | ConstructCoinpaymentsRequest<GetMerchantWalletByIdOperation>
  | ConstructCoinpaymentsRequest<GetMerchantWalletsOperation>
  | ConstructCoinpaymentsRequest<GetTransactionByWalletIdOperation>
  | ConstructCoinpaymentsRequest<GetTransactionsByWalletIdOperation>
  | ConstructCoinpaymentsRequest<GetWalletAddressesOperation>
  | ConstructCoinpaymentsRequest<SendSpendRequestOperation>
  | ConstructCoinpaymentsRequest<SpendRequestConfirmationOperation>
  // Webhook
  | ConstructCoinpaymentsRequest<UpdateWalletAddressWebhookOperation>
  | ConstructCoinpaymentsRequest<UpdateWalletWebhookOperation>
  | ConstructCoinpaymentsRequest<WalletNotificationPayloadOperation>
