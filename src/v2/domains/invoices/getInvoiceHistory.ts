import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions, RequestInput } from '@src/v2/types/operations'

import {
  internalCoinpaymentsFlow,
  withBody,
  withParams,
  withQueryParams
} from '@src/internal'
import {
  isNonEmptyString,
  isObject,
  optionalPropIs,
  requiredPropIs
} from '@src/utils/data'
import { paths } from '../../resources/swagger'

export const options = {
  operationId: 'getInvoiceHistory',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v2/merchant/invoices/{id}/history`
} as const satisfies OperationOptions

export type GetInvoiceHistoryOptions = typeof options

export type GetInvoiceHistoryParams = {
  /** @description string: invoice id */
  id: string
}

export type GetInvoiceHistoryQueryParams = never

export type GetInvoiceHistoryBody = never

export type GetInvoiceHistoryResponse = {
  items: Array<{
    /**
     * @description the timestamp of when the this event was observed
     * @example 2023-05-29T19:58:50.043Z
     */
    timestamp?: string
    /** @description the type of event that was observed. Possible values are - *created* – invoice has been created. Invoice stays in the “Created” status until payment is detected and invoice moves to “Pending”, or it is expired and moves to “TimedOut”, or it is cancelled by merchant and moves to “Cancelled”, or it is "Deleted" by merchant. - *updated* – invoice has been updated. Update can take place after invoice is created but before any payment on the invoice is detected. - *draft* – invoice is saved as draft. This is an invoice that has not been fully created and shared with buyer. No payment can be created for the invoice. - *scheduled* – invoice is created and saved for being activated (sent to buyer) for a future date. - *unpaid* – A buyer has initiated payment (checkout flow) but the payment has not been detected in the blockchain mempool yet. Invoice remains in the “Unpaid” status until buyer completes checkout and funds are detected in the blockchain mempool. In case buyer has completed payment checkout flow, invoice moves to the “Pending” status. If payment, nevertheless, fails, invoice moves back to “Unpaid”. - *pending* – funds for the invoice have been detected in the blockchain mempool or on chain. It can be either full payment or under-/overpayment. - *paid* – full payment for the invoice gets enough confirmations on chain. - *scheduledForPayout* – received funds are scheduled for payout according to the merchant settings, but payout has not been completed yet. - *completed* – payout is completed, funds have reached merchant’s destination address. - *cancelled* – merchant manually cancels invoice before buyer initiates first payment for the invoice. Also, if the initiated payment has expired and there are no funds detected on chain for the invoice, merchant still can cancel the invoice. - *cancelling* – the process of the invoice cancellation has been initiated. Since cancellation may take several seconds, it might result in an additional status of “Cancelling” and then invoice is set to the “Cancelled” status. - *timedOut* – invoice lifetime has timed out and no funds have been received on it so far, no pending payment has been detected, no checkout flow initiated at the moment of expiration. - *deleted* – merchant created invoice but then deletes it purposefully. At the moment of deletion no funds have been received on the invoice, no pending payment has been detected, no checkout flow initiated. */
    eventType?: string
  }>
  paging: {
    cursor?: {
      before?: string
      after?: string
    }
    /** @example 0 */
    limit?: number
    first?: string
    next?: string
    previous?: string
    last?: string
  }
}

export type GetInvoiceHistoryHttpOptions = {
  params: GetInvoiceHistoryParams
  queryParams: GetInvoiceHistoryQueryParams
  body: GetInvoiceHistoryBody
  response: GetInvoiceHistoryResponse
}

export type GetInvoiceHistoryOperation = GetInvoiceHistoryOptions &
  GetInvoiceHistoryHttpOptions

export const isValidRequestData = (
  input: unknown
): input is RequestInput<GetInvoiceHistoryOperation> =>
  isObject(input) && requiredPropIs(input, 'id', isNonEmptyString)

export const isValidResponseData = (
  response: unknown
): response is GetInvoiceHistoryHttpOptions['response'] =>
  Array.isArray(response) &&
  response.every(
    (item) =>
      isObject(item) &&
      optionalPropIs(item, 'id', isNonEmptyString) &&
      optionalPropIs(item, 'dateCreated', isNonEmptyString) &&
      optionalPropIs(item, 'event', isNonEmptyString) &&
      optionalPropIs(item, 'description', isNonEmptyString) &&
      optionalPropIs(item, 'data', isObject)
  )

export const getInvoiceHistory =
  internalCoinpaymentsFlow<GetInvoiceHistoryOperation>(options)(
    isValidRequestData
  )(isValidResponseData)(withParams('id'))(withQueryParams())(withBody())
