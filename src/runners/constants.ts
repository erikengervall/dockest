import { Runner } from './@types'

export const DEFAULT_CONFIG_VALUES: {
  AUTO_CREATE_TOPIC: boolean
  COMMANDS: string[]
  CONNECTION_TIMEOUT: number
  DEPENDS_ON: Runner[]
  HOST: string
  IMAGE: undefined
  RESPONSIVENESS_TIMEOUT: number
} = {
  AUTO_CREATE_TOPIC: true,
  COMMANDS: [],
  CONNECTION_TIMEOUT: 5,
  DEPENDS_ON: [],
  HOST: 'localhost',
  IMAGE: undefined,
  RESPONSIVENESS_TIMEOUT: 30,
}
