import { SharedDefaultableConfigProps } from './@types'

export const DEFAULT_CONFIG_PROPS = {
  AUTO_CREATE_TOPIC: true,
  COMMANDS: [],
  CONNECTION_TIMEOUT: 5,
  DEPENDS_ON: [],
  HOST: 'localhost',
  IMAGE: undefined,
  RESPONSIVENESS_TIMEOUT: 30,
}

export const SHARED_DEFAULT_CONFIG_PROPS: SharedDefaultableConfigProps = {
  commands: [],
  connectionTimeout: 5,
  dependsOn: [],
  host: 'localhost',
  image: null,
  ports: {},
  environment: {},
  props: {},
}
