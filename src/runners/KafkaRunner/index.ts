import { IBaseRunner } from '../'
import { ConfigurationError } from '../../errors'
import { validateInputFields } from '../../utils/config'
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
    this.validateKafkaConfig(config)
    this.kafkaExec = new KafkaExec()
    this.containerId = ''
    this.runnerKey = ''
  }

  public setup = async (runnerKey: string) => {
    this.runnerKey = runnerKey

    const containerId = await this.kafkaExec.start(this.config)
    this.containerId = containerId

    await this.kafkaExec.checkHealth(this.config)
  }

  public teardown = async (runnerKey: string) =>
    this.kafkaExec.teardown(this.containerId, runnerKey)

  public getHelpers = async () => ({
    clear: () => true,
    loadData: () => true,
  })

  private validateKafkaConfig = (config: IKafkaRunnerConfig): void => {
    if (!config) {
      throw new ConfigurationError('Missing configuration for Kafka runner')
    }

    const { service, host, ports, topics, zookeepeerConnect, autoCreateTopics } = config
    const requiredProps = { service, host, ports, topics, zookeepeerConnect, autoCreateTopics }

    if (!ports['9093']) {
      throw new ConfigurationError('Missing required port-mapping for Kafka runner')
    }

    validateInputFields('kafka', requiredProps)
  }
}

export default KafkaRunner
