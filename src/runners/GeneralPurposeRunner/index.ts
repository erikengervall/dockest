import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import { BaseRunner, GetComposeService, SharedRequiredConfigProps, SharedDefaultableConfigProps } from '../@types'
import { SHARED_DEFAULT_CONFIG_PROPS } from '../constants'
import getDependsOn from '../utils/getDependsOn'
import getImage from '../utils/getImage'
import getPorts from '../utils/getPorts'

interface RequiredConfigProps extends SharedRequiredConfigProps {} // eslint-disable-line
interface DefaultableConfigProps extends SharedDefaultableConfigProps {} // eslint-disable-line
interface GeneralPurposeRunnerConfig extends RequiredConfigProps, DefaultableConfigProps {}

const DEFAULT_CONFIG: DefaultableConfigProps = {
  ...SHARED_DEFAULT_CONFIG_PROPS,
}

class GeneralPurposeRunner implements BaseRunner {
  public containerId = ''
  public initializer = ''
  public runnerConfig: GeneralPurposeRunnerConfig
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
    const { dependsOn, image, ports, service, props } = this.runnerConfig

    return {
      [service]: {
        ...getDependsOn(dependsOn),
        ...getImage({ image, composeFileName, props, service }),
        ...getPorts(ports),
        ...props, // FIXME: Would love to type this stronger
      },
    }
  }
}

export { GeneralPurposeRunnerConfig }
export default GeneralPurposeRunner
