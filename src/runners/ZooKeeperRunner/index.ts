import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner from '../BaseRunner'
import { validateTypes } from '../utils'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  host: string
  port: number
  commands: [] // FIXME: Figure out how to remove this without upsetting `BaseRunner.ts`
}
type ZooKeeperRunnerConfig = RequiredConfigProps & DefaultableConfigProps
type ZooKeeperRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: 'localhost',
  port: 2181,
  commands: [],
}

const createStartCommand = (runnerConfig: ZooKeeperRunnerConfig): string => {
  const { port, service } = runnerConfig

  const portMapping = `--publish ${port}:2181`

  const cmd = ` \
                ${defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${service} \
              `

  return cmd.replace(/\s+/g, ' ').trim()
}

class ZooKeeperRunner extends BaseRunner {
  constructor(config: ZooKeeperRunnerConfigUserInput) {
    const commandCreators = {
      createStartCommand,
    }
    const runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    super(runnerConfig, commandCreators)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    this.validateConfig(schema, runnerConfig)
  }
}

export { ZooKeeperRunnerConfig }
export default ZooKeeperRunner
