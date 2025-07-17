export type ResolveAttributes<T> = [T] extends [never] ? {} : T
