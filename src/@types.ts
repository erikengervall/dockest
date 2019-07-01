export interface ErrorPayload {
  trap: string
  code?: number
  signal?: any
  error?: Error
  reason?: any
  p?: any
}
