import { IBaseRunner } from '../'
import { ConfigurationError } from '../../errors'
import { validateInputFields } from '../../utils/config'
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
    this.validateZookeeperConfig(config)
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.ZookeeperExec = new ZookeeperExec()
    this.containerId = ''
    this.runnerKey = ''
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

  private validateZookeeperConfig = (config: IZookeeperRunnerConfig): void => {
    if (!config) {
      throw new ConfigurationError('Missing configuration for Zookeeper runner')
    }

    const { service, port } = config
    const requiredProps = { service, port }

    validateInputFields('zookeeper', requiredProps)
  }
}

export default ZookeeeperRunner
