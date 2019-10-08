export interface ErrorPayload {
  trap: string
  code?: number
  error?: Error
  promise?: Promise<any>
  reason?: Error | any
  signal?: any
}

export interface ObjStrStr {
  [key: string]: string
}

export type ArrayAtLeastOne<T> = { [key: number]: T } & Array<T>
