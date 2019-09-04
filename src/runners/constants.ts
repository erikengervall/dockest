import { SharedDefaultableConfigProps } from './@types'

export const DEFAULT_CONFIG_PROPS = {
  AUTO_CREATE_TOPIC: true,
  COMMANDS: [],
  CONNECTION_TIMEOUT: 5,
  DEPENDS_ON: [],
  HOST: 'localhost',
  IMAGE: undefined,
  RESPONSIVENESS_TIMEOUT: 30,
  PORTS: {},
  PROPS: {},
}

export const SHARED_DEFAULT_CONFIG_PROPS: SharedDefaultableConfigProps = {
  commands: DEFAULT_CONFIG_PROPS.COMMANDS,
  connectionTimeout: DEFAULT_CONFIG_PROPS.CONNECTION_TIMEOUT,
  dependsOn: DEFAULT_CONFIG_PROPS.DEPENDS_ON,
  host: DEFAULT_CONFIG_PROPS.HOST,
  image: DEFAULT_CONFIG_PROPS.IMAGE,
  ports: DEFAULT_CONFIG_PROPS.PORTS,
  props: DEFAULT_CONFIG_PROPS.PROPS,
}
