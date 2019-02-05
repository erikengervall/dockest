import { IBaseRunner } from '../'
import { ConfigurationError } from '../../errors'
import { getMissingProps } from '../utils'
import KafkaExec from './execs'

interface IPorts {
  [key: string]: string | number
}

export interface IKafkaRunnerConfig {
  service: string
  host: string
  ports: IPorts
  topics: string[]
  zookeepeerConnect: string
  autoCreateTopics: boolean
  connectionTimeout?: number
}

const DEFAULT_CONFIG = {
  topics: [],
  autoCreateTopics: true,
}

export class KafkaRunner implements IBaseRunner {
  public config: IKafkaRunnerConfig
  public kafkaExec: KafkaExec
  public containerId: string
  public runnerKey: string

  constructor(config: IKafkaRunnerConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.kafkaExec = new KafkaExec()
    this.containerId = ''
    this.runnerKey = ''

    this.validateConfig()
  }

  public setup = async (runnerKey: string) => {
    this.runnerKey = runnerKey

    const containerId = await this.kafkaExec.start(this.config, runnerKey)
    this.containerId = containerId

    await this.kafkaExec.checkHealth(this.config, runnerKey)
  }

  public teardown = async (runnerKey: string) =>
    this.kafkaExec.teardown(this.containerId, runnerKey)

  public getHelpers = async () => ({
    clear: () => true,
    loadData: () => true,
  })

  private validateConfig = () => {
    if (!this.config) {
      throw new ConfigurationError('config')
    }

    // validate required props
    const { service, host, ports, topics, zookeepeerConnect, autoCreateTopics } = this.config
    const requiredProps: { [key: string]: any } = {
      service,
      host,
      ports,
      topics,
      zookeepeerConnect,
      autoCreateTopics,
    }

    if (!ports['9093']) {
      throw new ConfigurationError('Missing required port-mapping for Kafka runner')
    }

    const missingProps = getMissingProps(requiredProps)
    if (missingProps.length > 0) {
      throw new ConfigurationError(`${missingProps.join(', ')}`)
    }
  }
}

export default KafkaRunner
