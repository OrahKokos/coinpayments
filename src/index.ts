import { CMDS } from './constants';
import CoinpaymentsError from './error';
import {
  mapPayload,
  mapMassWithdrawalPayload,
  mapGetTxMultiPayload,
} from './mappers';
import { request } from './internal';

import { CoinpaymentsCredentials, returnCallback } from './types/base';
import {
  CoinpaymentsRatesOpts,
  CoinpaymentsGetBasicInfoOpts,
  CoinpaymentsGetCallbackAddressOpts,
  CoinpaymentsCreateTransactionOpts,
  CoinpaymentsGetTxOpts,
  CoinpaymentsGetTxMultiOpts,
  CoinpaymentsGetTxListOpts,
  CoinpaymentsBalancesOpts,
  CoinpaymentsGetDepositAddressOpts,
  CoinpaymentsCreateMassWithdrawalOpts,
  CoinpaymentsConvertCoinsOpts,
  CoinpaymentsConvertLimitsOpts,
  CoinpaymentsGetWithdrawalHistoryOpts,
  CoinpaymentsGetWithdrawalInfoOpts,
  CoinpaymentsGetConversionInfoOpts,
  CoinpaymentsGetProfileOpts,
  CoinpaymentsTagListOpts,
  CoinpaymentsClaimTagOpts,
  CoinpaymentsUpdateTagProfileOpts,
  CoinpaymentsRenewTagOpts,
  CoinpaymentsDeleteTagOpts,
  CoinpaymentsClaimCouponOpts,
  CoinpaymentsBuyTagOpts,
  CoinpaymentsCreateTransferOpts,
  CoinpaymentsCreateWithdrawalOpts,
} from './types/options';

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

export default class Coinpayments {
  private credentials: CoinpaymentsCredentials;

  constructor({ key = '', secret = '' }: CoinpaymentsCredentials) {
    if (!key) {
      throw new CoinpaymentsError('Missing public key');
    }
    if (!secret) {
      throw new CoinpaymentsError('Missing private key');
    }

    this.credentials = { key, secret };
  }

  /**
   *
   * @param {Object} [options]
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public rates(
    options?: CoinpaymentsRatesOpts | returnCallback<CoinpaymentsRatesResponse>,
    callback?: returnCallback<CoinpaymentsRatesResponse>
  ) {
    if (!options && !callback) {
      options = {};
    }
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    const requestPayload = mapPayload<CoinpaymentsRatesOpts>(options, {
      cmd: CMDS.RATES,
    });

    return request<CoinpaymentsRatesResponse>(
      this.credentials,
      requestPayload,
      callback
    );
  }

  public createTransaction(
    options: CoinpaymentsCreateTransactionOpts,
    callback?: returnCallback<CoinpaymentsCreateTransactionResponse>
  ) {
    return request<CoinpaymentsCreateTransactionResponse>(
      this.credentials,
      mapPayload<CoinpaymentsCreateTransactionOpts>(options, {
        cmd: CMDS.CREATE_TRANSACTION,
      }),
      callback
    );
  }

  /**
   *
   * @param {Object} [options]
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public balances(
    options?:
      | CoinpaymentsBalancesOpts
      | returnCallback<CoinpaymentsBalancesResponse>,
    callback?: returnCallback<CoinpaymentsBalancesResponse>
  ) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return request<CoinpaymentsBalancesResponse>(
      this.credentials,
      mapPayload<CoinpaymentsBalancesOpts>(options, {
        cmd: CMDS.BALANCES,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public createWithdrawal(
    options: CoinpaymentsCreateWithdrawalOpts,
    callback?: returnCallback<CoinpaymentsCreateWithdrawalResponse>
  ) {
    return request<CoinpaymentsCreateWithdrawalResponse>(
      this.credentials,
      mapPayload<CoinpaymentsCreateWithdrawalOpts>(options, {
        cmd: CMDS.CREATE_WITHDRAWAL,
        auto_confirm: true,
      }),
      callback
    );
  }
  /**
   *
   * @param {Array} withdrawalArray
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public createMassWithdrawal(
    withdrawalArray: CoinpaymentsCreateMassWithdrawalOpts,
    callback?: returnCallback<CoinpaymentsCreateMassWithdrawalResponse>
  ) {
    // Should throw validation error => 3.0.0
    withdrawalArray = withdrawalArray.filter(
      w => w.currency && w.amount && w.address
    );

    return request<CoinpaymentsCreateMassWithdrawalResponse>(
      this.credentials,
      mapMassWithdrawalPayload(withdrawalArray, {
        cmd: CMDS.CREATE_MASS_WITHDRAWAL,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public getTx(
    options: CoinpaymentsGetTxOpts,
    callback?: returnCallback<CoinpaymentsGetTxResponse>
  ) {
    return request<CoinpaymentsGetTxResponse>(
      this.credentials,
      mapPayload<CoinpaymentsGetTxOpts>(options, {
        cmd: CMDS.GET_TX,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public getWithdrawalInfo(
    options: CoinpaymentsGetWithdrawalInfoOpts,
    callback?: returnCallback<CoinpaymentsGetWithdrawalInfoResponse>
  ) {
    return request<CoinpaymentsGetWithdrawalInfoResponse>(
      this.credentials,
      mapPayload<CoinpaymentsGetWithdrawalInfoOpts>(options, {
        cmd: CMDS.GET_WITHDRAWAL_INFO,
      }),
      callback
    );
  }
  /**
   *
   * @param {Array} txIdArray
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public getTxMulti(
    txIdArray: CoinpaymentsGetTxMultiOpts,
    callback?: returnCallback<CoinpaymentsGetTxMultiResponse>
  ) {
    if (!(txIdArray instanceof Array) || !txIdArray.length) {
      return callback(new CoinpaymentsError('Invalid argument', txIdArray));
    }
    return request<CoinpaymentsGetTxMultiResponse>(
      this.credentials,
      mapGetTxMultiPayload(txIdArray, {
        cmd: CMDS.GET_TX_MULTI,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} [options]
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public getTxList(
    options?: CoinpaymentsGetTxListOpts,
    callback?: returnCallback<CoinpaymentsGetTxListResponse>
  ) {
    if (!options && !callback) {
      options = {};
    }
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return request<CoinpaymentsGetTxListResponse>(
      this.credentials,
      mapPayload<CoinpaymentsGetTxListOpts>(options, {
        cmd: CMDS.GET_TX_LIST,
      }),
      callback
    );
  }
  /**
   *
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public getBasicInfo(
    callback?: returnCallback<CoinpaymentsGetBasicInfoResponse>
  ) {
    return request<CoinpaymentsGetBasicInfoResponse>(
      this.credentials,
      mapPayload<CoinpaymentsGetBasicInfoOpts>(
        {},
        {
          cmd: CMDS.GET_BASIC_INFO,
        }
      ),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public getDepositAddress(
    options: CoinpaymentsGetDepositAddressOpts,
    callback?: returnCallback<CoinpaymentsGetDepositAddressResponse>
  ) {
    return request<CoinpaymentsGetDepositAddressResponse>(
      this.credentials,
      mapPayload<CoinpaymentsGetDepositAddressOpts>(options, {
        cmd: CMDS.GET_DEPOSIT_ADDRESS,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public getCallbackAddress(
    options: CoinpaymentsGetCallbackAddressOpts,
    callback?: returnCallback<CoinpaymentsGetCallbackAddressResponse>
  ) {
    return request<CoinpaymentsGetCallbackAddressResponse>(
      this.credentials,
      mapPayload<CoinpaymentsGetCallbackAddressOpts>(options, {
        cmd: CMDS.GET_CALLBACK_ADDRESS,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public createTransfer(
    options: CoinpaymentsCreateTransferOpts,
    callback?: returnCallback<CoinpaymentsCreateTransferResponse>
  ) {
    return request<CoinpaymentsCreateTransferResponse>(
      this.credentials,
      mapPayload<CoinpaymentsCreateTransferOpts>(options, {
        auto_confirm: 1,
        cmd: CMDS.CREATE_TRANSFER,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public convertCoins(
    options: CoinpaymentsConvertCoinsOpts,
    callback?: returnCallback<CoinpaymentsConvertCoinsResponse>
  ) {
    return request<CoinpaymentsConvertCoinsResponse>(
      this.credentials,
      mapPayload<CoinpaymentsConvertCoinsOpts>(options, {
        cmd: CMDS.CONVERT,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public convertLimits(
    options: CoinpaymentsConvertLimitsOpts,
    callback?: returnCallback<CoinpaymentsConvertLimitsResponse>
  ) {
    return request<CoinpaymentsConvertLimitsResponse>(
      this.credentials,
      mapPayload<CoinpaymentsConvertLimitsOpts>(options, {
        cmd: CMDS.CONVERT_LIMITS,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} [options]
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public getWithdrawalHistory(
    options: CoinpaymentsGetWithdrawalHistoryOpts,
    callback?: returnCallback<CoinpaymentsGetWithdrawalHistoryResponse>
  ) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return request<CoinpaymentsGetWithdrawalHistoryResponse>(
      this.credentials,
      mapPayload<CoinpaymentsGetWithdrawalHistoryOpts>(options, {
        cmd: CMDS.GET_WITHDRAWAL_HISTORY,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public getConversionInfo(
    options: CoinpaymentsGetConversionInfoOpts,
    callback?: returnCallback<CoinpaymentsConversionInfoResponse>
  ) {
    return request<CoinpaymentsConversionInfoResponse>(
      this.credentials,
      mapPayload<CoinpaymentsGetConversionInfoOpts>(options, {
        cmd: CMDS.GET_CONVERSATION_INFO,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public getProfile(
    options: CoinpaymentsGetProfileOpts,
    callback?: returnCallback<CoinpaymentsGetProfileResponse>
  ) {
    return request<CoinpaymentsGetProfileResponse>(
      this.credentials,
      mapPayload<CoinpaymentsGetProfileOpts>(options, {
        cmd: CMDS.GET_TAG_INFO,
      }),
      callback
    );
  }
  /**
   *
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public tagList(callback?: returnCallback<CoinpaymentsTagListResponse>) {
    return request<CoinpaymentsTagListResponse>(
      this.credentials,
      mapPayload<CoinpaymentsTagListOpts>(
        {},
        {
          cmd: CMDS.GET_TAG_LIST,
        }
      ),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public updateTagProfile(
    options: CoinpaymentsUpdateTagProfileOpts,
    callback?: returnCallback<CoinpaymentsUpdateTagProfileResponse>
  ) {
    return request<CoinpaymentsUpdateTagProfileResponse>(
      this.credentials,
      mapPayload<CoinpaymentsUpdateTagProfileOpts>(options, {
        cmd: CMDS.UPDATE_TAG,
      }),
      callback
    );
  }
  /**
   *
   * @param {Object} options
   * @param {Function} [callback]
   * @returns {(Function|Promise)}
   */
  public claimTag(
    options: CoinpaymentsClaimTagOpts,
    callback?: returnCallback<CoinpaymentsClaimTagResponse>
  ) {
    return request<CoinpaymentsClaimTagResponse>(
      this.credentials,
      mapPayload<CoinpaymentsClaimTagOpts>(options, {
        cmd: CMDS.CLAIM_TAG,
      }),
      callback
    );
  }
  /**
   * new
   */
  public renewTag(
    options: CoinpaymentsRenewTagOpts,
    callback?: returnCallback<CoinpaymentsRenameTagResponse>
  ) {
    return request<CoinpaymentsRenameTagResponse>(
      this.credentials,
      mapPayload<CoinpaymentsRenewTagOpts>(options, {
        cmd: CMDS.RENEW_TAG,
      }),
      callback
    );
  }

  /**
   * new
   */
  public deleteTag(
    options: CoinpaymentsDeleteTagOpts,
    callback?: returnCallback<CoinpaymentsDeleteTagResponse>
  ) {
    return request<CoinpaymentsDeleteTagResponse>(
      this.credentials,
      mapPayload<CoinpaymentsDeleteTagOpts>(options, {
        cmd: CMDS.RENEW_TAG,
      }),
      callback
    );
  }

  /**
   * new
   */
  public claimCoupon(
    options: CoinpaymentsClaimCouponOpts,
    callback?: returnCallback<CoinpaymentsClaimCouponResponse>
  ) {
    return request<CoinpaymentsClaimCouponResponse>(
      this.credentials,
      mapPayload<CoinpaymentsClaimCouponOpts>(options, {
        cmd: CMDS.CLAIM_COUPON,
      }),
      callback
    );
  }

  /**
   * new
   */
  public buyTag(
    options: CoinpaymentsBuyTagOpts,
    callback?: returnCallback<CoinpaymentsBuyTagResponse>
  ) {
    return request<CoinpaymentsBuyTagResponse>(
      this.credentials,
      mapPayload<CoinpaymentsBuyTagOpts>(options, {
        cmd: CMDS.BUY_TAG,
      }),
      callback
    );
  }
}
