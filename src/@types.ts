export interface ErrorPayload {
  trap: string
  code?: number
  signal?: any
  error?: Error
  reason?: Error | any
  promise?: Promise<any>
}
