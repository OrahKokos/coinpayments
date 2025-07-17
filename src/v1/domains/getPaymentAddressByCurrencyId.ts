import { COINPAYMENTS_API_URL } from '@src/v2/constants'
import { OperationOptions } from '@src/v2/types/operations'
import { paths } from '../../v2/resources/swagger'

export const options = {
  operationId: 'getPaymentAddressByCurrencyId',
  method: 'GET',
  url: `${COINPAYMENTS_API_URL}/v1/invoices/{id}/payment-currencies/{currencyId}`
} as const satisfies OperationOptions
