import { IBaseRunner } from '../'
import { ConfigurationError } from '../../errors'
import { getMissingProps } from '../utils'
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
  public containerId: string
  public runnerKey: string

  constructor(config: IZookeeperRunnerConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.ZookeeperExec = new ZookeeperExec()
    this.containerId = ''
    this.runnerKey = ''

    this.validateInput()
  }

  public setup = async (runnerKey: string) => {
    this.runnerKey = runnerKey

    const containerId = await this.ZookeeperExec.start(this.config, runnerKey)
    this.containerId = containerId

    await this.ZookeeperExec.checkHealth(this.config, runnerKey)
  }

  public teardown = async (runnerKey: string) =>
    this.ZookeeperExec.teardown(this.containerId, runnerKey)

  public getHelpers = async () => ({
    clear: () => true,
    loadData: () => true,
  })

  private validateInput = () => {
    // validate config
    if (!this.config) {
      throw new ConfigurationError(`config`)
    }

    // validate required props
    const { service, port } = this.config
    const requiredProps: { [key: string]: any } = { service, port }
    const missingProps = getMissingProps(requiredProps)
    if (missingProps.length > 0) {
      throw new ConfigurationError(`${missingProps.join(', ')}`)
    }
  }
}

export default ZookeeeperRunner
