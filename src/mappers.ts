import { CoinpaymentsRequest } from './types/base'
import {
  CoinpaymentsCreateMassWithdrawalOpts,
  CoinpaymentsGetTxMultiOpts,
} from './types/options'

export const mapPayload = <ExpectedOptions>(
  opts: ExpectedOptions,
  defaultRequestFields: CoinpaymentsRequest
): CoinpaymentsRequest => {
  return {
    ...defaultRequestFields,
    ...opts,
  }
}

export const mapMassWithdrawalPayload = (
  withdrawalArray: CoinpaymentsCreateMassWithdrawalOpts,
  defaultFields: CoinpaymentsRequest
): CoinpaymentsRequest => {
  const payload = withdrawalArray.reduce((ops, w, index) => {
    ops[`wd[wd${index + 1}][amount]`] = w.amount
    ops[`wd[wd${index + 1}][address]`] = w.address
    ops[`wd[wd${index + 1}][currency]`] = w.currency

    if (w.dest_tag) {
      ops[`wd[wd${index + 1}][dest_tag]`] = w.dest_tag
    }

    return ops
  }, {})
  return {
    ...defaultFields,
    ...payload,
  }
}

export const mapGetTxMultiPayload = (
  txArray: CoinpaymentsGetTxMultiOpts,
  defaultFields: CoinpaymentsRequest
): CoinpaymentsRequest => {
  const payload = { txid: txArray.join('|') }
  return {
    ...defaultFields,
    ...payload,
  }
}
