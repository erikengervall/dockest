import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import {
  Runner,
  BaseRunner,
  GetComposeService,
  SharedRequiredConfigProps,
  SharedDefaultableConfigProps,
} from '../@types'
import { ObjStrStr } from '../../@types'
import { DEFAULT_CONFIG_PROPS } from '../constants'
import getDependsOn from '../utils/getDependsOn'
import getImage from '../utils/getImage'
import getPorts from '../utils/getPorts'

type RequiredConfigProps = {
  service: string
} & SharedRequiredConfigProps

type DefaultableConfigProps = {
  commands: string[]
  connectionTimeout: number
  dependsOn: Runner[]
  host: string
  image: string | undefined | null
  ports: ObjStrStr
  environment: ObjStrStr
} & SharedDefaultableConfigProps

type SimpleRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_CONFIG: DefaultableConfigProps = {
  commands: DEFAULT_CONFIG_PROPS.COMMANDS,
  connectionTimeout: DEFAULT_CONFIG_PROPS.CONNECTION_TIMEOUT,
  host: DEFAULT_CONFIG_PROPS.HOST,
  dependsOn: DEFAULT_CONFIG_PROPS.DEPENDS_ON,
  image: DEFAULT_CONFIG_PROPS.IMAGE,
  ports: {},
  environment: {},
}

class SimpleRunner implements BaseRunner {
  public containerId = ''
  public initializer = ''
  public runnerConfig: SimpleRunnerConfig
  public logger: Logger

  public constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.logger = new Logger(this)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = composeFileName => {
    const { dependsOn, image, ports, service, environment } = this.runnerConfig

    return {
      [service]: {
        environment: {
          ...environment,
        },
        ...getDependsOn(dependsOn),
        ...getImage({ image, composeFileName, service }),
        ...getPorts(ports),
      },
    }
  }
}

export { SimpleRunnerConfig }
export default SimpleRunner
