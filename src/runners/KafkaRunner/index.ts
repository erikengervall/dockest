import { IBaseRunner } from '../'
import { ConfigurationError } from '../../errors'
import { validateTypes } from '../utils'
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

  private validateConfig = () => {
    const schema = {
      service: validateTypes.isString,
      host: validateTypes.isString,
      ports: validateTypes.isArrayOfType(validateTypes.isNumber),
      topics: validateTypes.isArray,
      zookeepeerConnect: validateTypes.isString,
      autoCreateTopics: validateTypes.isBoolean,
    }

    const failures = validateTypes(schema, this.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }
}

export default KafkaRunner
