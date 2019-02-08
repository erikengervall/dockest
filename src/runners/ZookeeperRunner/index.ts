import { ConfigurationError } from '../../errors'
import { IBaseRunner } from '../index'
import { validateTypes } from '../utils'
import ZookeeperExec from './execs'

export interface IZookeeperRunnerConfig {
  service: string
  port: number
  connectionTimeout?: number
}

const DEFAULT_CONFIG = {}

export class ZookeeeperRunner implements IBaseRunner {
  public config: IZookeeperRunnerConfig
  public ZookeeperExec: ZookeeperExec
  public containerId: string = ''
  public runnerKey: string = ''

  constructor(config: IZookeeperRunnerConfig) {
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
    const schema = {
      service: validateTypes.isString,
      port: validateTypes.isNumber,
    }

    const failures = validateTypes(schema, this.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }
}

export default ZookeeeperRunner
