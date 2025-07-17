export type CoinpaymentsError = {
  type: 'BAD_INPUT'
  message: string
  data: unknown
}

export const createCoinpaymentsError = (
  message: string,
  data: unknown
): CoinpaymentsError => ({
  type: 'BAD_INPUT',
  message,
  data
})
