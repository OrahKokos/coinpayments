export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const hasOwn = <T extends Record<string, unknown>, Prop extends string>(
  obj: T,
  prop: Prop
): obj is T & { [K in Prop]: unknown } => Object.hasOwn(obj, prop)

export const isEmptyObject = (
  value: unknown
): value is Record<string, unknown> =>
  isObject(value) && Object.keys(value).length === 0

export type Stringified<T> = T extends
  | string
  | number
  | boolean
  | null
  | undefined
  | symbol
  | bigint
  | Function
  ? string
  : T extends (infer U)[]
    ? Stringified<U>[]
    : T extends object
      ? { [K in keyof T]: Stringified<T[K]> }
      : T

export const stringifyObjectValues = <T>(input: T): Stringified<T> => {
  if (input === null || typeof input === 'undefined') {
    return String(input) as Stringified<T>
  }
  if (Array.isArray(input)) {
    return input.map((item) => stringifyObjectValues(item)) as Stringified<T>
  }
  if (!isObject(input)) {
    return String(input) as Stringified<T>
  }

  const newObject: { [key: string]: any } = {}
  for (const key in input) {
    if (hasOwn(input, key)) {
      newObject[key] = stringifyObjectValues(input[key])
    }
  }

  return newObject as Stringified<T>
}

export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result: Partial<T> = {}
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result as Pick<T, K>
}

export const isString = (value: unknown): value is string =>
  typeof value === 'string' || value instanceof String

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' || value instanceof Number

export const isPositiveNumber = (value: unknown): value is number =>
  isNumber(value) && value > 0

export const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.trim() !== ''

export const isArrayOfExactStrings = (
  value: unknown,
  allowedValues?: Array<string>
): value is Array<string> => {
  if (!Array.isArray(value)) return false
  if (allowedValues) {
    return value.every((item) => isString(item) && allowedValues.includes(item))
  }
  return value.every((item) => isString(item))
}

export const inArray =
  <T>(array: T[]) =>
  (value: unknown): value is T =>
    array.includes(value as T)

export const withTarget =
  <const Target extends string>(target: Target) =>
  <Source extends Record<string, unknown>>(...keys: Array<keyof Source>) =>
  (source: Source) =>
    ({
      [target]: pick(source, keys)
    }) as { [T in Target]: Pick<Source, (typeof keys)[number]> }

export const alwaysTrueGuard =
  <T>() =>
  (_: unknown): _ is T =>
    true

export const propIs =
  (onPropNotFound: () => boolean) =>
  <T extends Record<string, unknown>, K extends string, V = unknown>(
    obj: T,
    key: K,
    predicate: (value: unknown) => value is V
  ): obj is T & { [P in K]: V } => {
    if (!hasOwn(obj, key)) return onPropNotFound()
    return predicate(obj[key])
  }

export const requiredPropIs = propIs(() => false)
export const optionalPropIs = propIs(() => true)

export const getIsoDate = (): string => new Date().toISOString().split('.')[0]

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean'
