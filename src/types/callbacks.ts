import CoinpaymentsError from '../error';

import {
  CoinpaymentsRatesResponse,
  CoinpaymentsCreateTransactionResponse,
  CoinpaymentsBalancesResponse,
  CoinpaymentsCreateWithdrawalResponse,
  CoinpaymentsCreateMassWithdrawalResponse,
  CoinpaymentsGetTxResponse,
  CoinpaymentsGetWithdrawalInfoResponse,
  CoinpaymentsGetTxListResponse,
  CoinpaymentsGetTxMultiResponse,
  CoinpaymentsGetBasicInfoResponse,
  CoinpaymentsGetDepositAddressResponse,
  CoinpaymentsGetCallbackAddressResponse,
  CoinpaymentsCreateTransferResponse,
  CoinpaymentsConvertCoinsResponse,
  CoinpaymentsConvertLimitsResponse,
  CoinpaymentsGetWithdrawalHistoryResponse,
  CoinpaymentsConversionInfoResponse,
  CoinpaymentsGetProfileResponse,
  CoinpaymentsTagListResponse,
  CoinpaymentsUpdateTagProfileResponse,
  CoinpaymentsClaimTagResponse,
  CoinpaymentsRenameTagResponse,
  CoinpaymentsDeleteTagResponse,
  CoinpaymentsClaimCouponResponse,
  CoinpaymentsBuyTagResponse,
} from './types/response';

export type CoinpaymentsRatesCallback = (
  CoinpaymentsError?,
  CoinpaymentsRatesResponse?
) => any;

export type CoinpaymentsCreateTransactionCallback = (
  CoinpaymentsError?,
  CoinpaymentsCreateTransactionResponse?
) => any;

export type CoinpaymentsBalancesCallback = (
  CoinpaymentsError?,
  CoinpaymentsBalancesResponse?
) => any;
