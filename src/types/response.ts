import { isCoinpaymentsError } from './base';

export interface CoinpaymentsGetBasicInfoResponse {
  uername: string;
  username: string;
  merchant_id: string;
  email: string;
  public_name: string;
  time_joined: number;
  kyc_status: boolean;
  swych_tos_accepted: boolean;
}

export interface CoinpaymentsGetProfileResponse {
  pbntag: string;
  merchant: string;
  profile_name: string;
  profile_url: string;
  profile_email: string;
  profile_image: string;
  member_since: number;
  feedback: {
    pos: number;
    neg: number;
    neut: number;
    total: number;
    percent: string;
    percent_str: string;
  };
}

export interface CoinpaymentsTagListResponseSingle {
  tagid: string;
  pbntag: string;
  time_expires: number;
}

export type CoinpaymentsTagListResponse = CoinpaymentsTagListResponseSingle[];

export type CoinpaymentsClaimTagResponse = [];

export type CoinpaymentsClaimCouponResponse = [];

export type CoinpaymentsRenameTagResponse = [];

export type CoinpaymentsUpdateTagProfileResponse = [];

export interface CoinpaymentsGetDepositAddressResponse {
  address: string;
}

export interface CoinpaymentsGetCallbackAddressResponse {
  address: string;
}

export interface CoinpaymentsRatesResponse {
  [coinAbbrv: string]: {
    is_fiat: number | boolean;
    rate_btc: string;
    last_update: string;
    tx_fee: string;
    status: string;
    name: string;
    confirms: string;
    can_convert: number | boolean;
    capabilities: string[];
    explorer: string;
  };
}

export interface CoinpaymentsBalancesResponse {
  [coinAbbrv: string]: {
    balance: number;
    balancef: string;
    status: string;
    coin_status: string;
  };
}

export interface CoinpaymentsCreateTransactionResponse {
  amount: string;
  txn_id: string;
  address: string;
  confirms_needed: string;
  timeout: number;
  checkout_url: string;
  status_url: string;
  qrcode_url: string;
}

export interface CoinpaymentsGetTxResponse {
  time_created: number;
  time_expires: number;
  status: number;
  status_text: string;
  type: string;
  coin: string;
  amount: number;
  amountf: string;
  received: number;
  receivedf: string;
  recv_confirms: number;
  payment_address: string;
}

export interface CoinpaymentsGetTxMultiResponse {
  [tx: string]: {
    error: string;
    amount: string;
    txn_id: string;
    address: string;
    confirms_needed: string;
    timeout: number;
    status_url: string;
    qrcode_url: string;
  };
}

export type CoinpaymentsGetTxListResponse = string[];

export interface CoinpaymentsConvertLimitsResponse {
  min: string;
  max: string;
  shapeshift_linked: boolean;
}

export interface CoinpaymentsConvertCoinsResponse {
  id: string;
}

export interface CoinpaymentsConversionInfoResponse {
  time_created: number;
  status: number;
  status_text: string;
  coin1: string;
  coin2: string;
  amount_sent: number;
  amount_sentf: string;
  received: number;
  receivedf: string;
}

export interface CoinpaymentsCreateTransferResponse {
  id: string;
  status: number;
}

export interface CoinpaymentsCreateWithdrawalResponse {
  id: string;
  amount: string;
  status: number;
}

export interface CoinpaymentsCreateWithdrawalResponse {}

export interface CoinpaymentsCreateMassWithdrawalResponse {
  [wd: string]: {
    error: isCoinpaymentsError;
    id: string;
    status: number;
    amount: string;
  };
}

export interface CoinpaymentsGetWithdrawalInfoResponse {
  time_created: number;
  status: number;
  status_text: string;
  coin: string;
  amount: number;
  amountf: string;
  send_address: string;
  send_txid: string;
}

export interface CoinpaymentsGetWithdrawalHistoryResponseSingle {
  id: string;
  time_created: number;
  status: number;
  status_text: string;
  coin: string;
  amount: number;
  amountf: string;
  send_address: string;
  send_txid: string;
}

export type CoinpaymentsGetWithdrawalHistoryResponse =
  CoinpaymentsGetWithdrawalHistoryResponseSingle[];

export type CoinpaymentsDeleteTagResponse = [];

export type CoinpaymentsBuyTagResponse = [];
