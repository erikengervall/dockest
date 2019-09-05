import { default as pathLib } from 'path'

export const EXTERNAL_PORT = 1338
export const INTERNAL_PORT = EXTERNAL_PORT
export const BASE_URL = `http://localhost:${EXTERNAL_PORT}/`
export const SERVICE_NAME = 'orders'
export const PATH = pathLib.resolve(__dirname)
