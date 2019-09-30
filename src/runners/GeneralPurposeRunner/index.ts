import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import {
  BaseRunner,
  GetComposeService,
  SharedRequiredConfigProps,
  SharedDefaultableConfigProps,
  ComposeService,
} from '../@types'
import { SHARED_DEFAULT_CONFIG_PROPS } from '../constants'
import { defaultGetComposeService } from '../composeFileHelper'

interface RequiredConfigProps extends SharedRequiredConfigProps {}
interface OptionalConfigProps {
  getResponsivenessCheckCommand: (containerId: string) => string
}
interface DefaultableConfigProps extends SharedDefaultableConfigProps {}
interface GeneralPurposeRunnerConfig
  extends RequiredConfigProps,
    Partial<OptionalConfigProps>,
    DefaultableConfigProps {}

const DEFAULT_CONFIG: DefaultableConfigProps = {
  ...SHARED_DEFAULT_CONFIG_PROPS,
}

class GeneralPurposeRunner implements BaseRunner {
  public containerId = ''
  public initializer = ''
  public runnerConfig: GeneralPurposeRunnerConfig
  public logger: Logger
  public createResponsivenessCheckCmd: (() => string) | null = null

  public constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps> & Partial<OptionalConfigProps>) {
    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    if (this.runnerConfig.getResponsivenessCheckCommand) {
      this.createResponsivenessCheckCmd = () => {
        if (!this.runnerConfig.getResponsivenessCheckCommand) {
          throw new Error('Invalid state')
        }
        const command = this.runnerConfig.getResponsivenessCheckCommand(this.containerId)
        return command
      }
    }

    this.logger = new Logger(this)
  }

  public mergeConfig({ ports, build, image, networks, ...composeService }: ComposeService) {
    this.runnerConfig = {
      ...this.runnerConfig,
      ...composeService,
      ...(image ? { image } : {}),
      ...(build ? { build } : {}),
      ...(ports ? { ports } : {}),
      ...(networks ? { networks: Object.keys(networks) } : {}),
    }
  }

  public validateConfig() {
    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = () => defaultGetComposeService(this.runnerConfig)
}

export { GeneralPurposeRunnerConfig }
export default GeneralPurposeRunner
