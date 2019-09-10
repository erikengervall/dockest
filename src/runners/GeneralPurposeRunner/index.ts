import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import { BaseRunner, GetComposeService, SharedRequiredConfigProps, SharedDefaultableConfigProps } from '../@types'
import { SHARED_DEFAULT_CONFIG_PROPS } from '../constants'
import { defaultGetComposeService } from '../composeFileHelper'

interface RequiredConfigProps extends SharedRequiredConfigProps {}
interface DefaultableConfigProps extends SharedDefaultableConfigProps {}
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

  public getComposeService: GetComposeService = () => defaultGetComposeService(this.runnerConfig)
}

export { GeneralPurposeRunnerConfig }
export default GeneralPurposeRunner
