export interface ErrorPayload {
  trap: string
  code?: number
  signal?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: Error
  reason?: Error | any // eslint-disable-line @typescript-eslint/no-explicit-any
  promise?: Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
}
