import { ConfigurationError } from '../../errors'
import { BaseRunner } from '../index'
import { validateTypes } from '../utils'
import ZookeeperExec from './execs'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  port: number
  commands: string[]
  connectionTimeout: number
}
export type ZookeeperRunnerConfig = RequiredConfigProps & DefaultableConfigProps
type ZookeeperRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

const DEFAULT_CONFIG: DefaultableConfigProps = {
  port: 2181,
  commands: [],
  connectionTimeout: 30,
}

export class ZookeeeperRunner implements BaseRunner {
  public config: ZookeeperRunnerConfig
  public ZookeeperExec: ZookeeperExec
  public containerId: string = ''
  public runnerKey: string = ''

  constructor(config: ZookeeperRunnerConfigUserInput) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.ZookeeperExec = new ZookeeperExec()

    this.validateInput()
  }

  public setup = async (runnerKey: string) => {
    this.runnerKey = runnerKey

    const containerId = await this.ZookeeperExec.start(this.config, runnerKey)
    this.containerId = containerId

    await this.ZookeeperExec.checkHealth(this.config, runnerKey)
  }

  public teardown = async () => this.ZookeeperExec.teardown(this.containerId, this.runnerKey)

  private validateInput = () => {
    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }

    const failures = validateTypes(schema, this.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }
}

export default ZookeeeperRunner
