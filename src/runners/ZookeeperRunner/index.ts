import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner from '../BaseRunner'
import { validateTypes } from '../utils'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  port: number
  commands: string[]
  connectionTimeout: number
}
type ZookeeperRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>
export type ZookeeperRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_CONFIG: DefaultableConfigProps = {
  port: 2181,
  commands: [],
  connectionTimeout: 30,
}

const createStartCommand = (runnerConfig: ZookeeperRunnerConfig) => {
  const { port, service } = runnerConfig

  const portMapping = `--publish ${port}:2181`
  const cmd = `docker-compose run \
                ${defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${service}`

  return cmd.replace(/\s+/g, ' ').trim()
}

export default class ZookeeeperRunner extends BaseRunner {
  constructor(config: ZookeeperRunnerConfigUserInput) {
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
