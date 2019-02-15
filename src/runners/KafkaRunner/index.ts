import { ConfigurationError } from '../../errors'
import { BaseRunner } from '../index'
import { validateTypes } from '../utils'
import KafkaExec from './execs'

interface RequiredConfigProps {
  service: string
  zookeepeerConnect: string
  topics: string[]
}
interface DefaultableConfigProps {
  host: string
  ports: { [key: string]: string | number }
  autoCreateTopics: boolean
  commands: string[]
  connectionTimeout: number
}
export type KafkaRunnerConfig = RequiredConfigProps & DefaultableConfigProps
export type KafkaRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: 'localhost',
  ports: { '9092': '9092', '9093': '9093', '9094': '9094' },
  autoCreateTopics: true,
  commands: [],
  connectionTimeout: 30,
}

export class KafkaRunner implements BaseRunner {
  public config: RequiredConfigProps & DefaultableConfigProps
  public kafkaExec: KafkaExec
  public containerId: string = ''
  public runnerKey: string = ''

  constructor(config: KafkaRunnerConfigUserInput) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.kafkaExec = new KafkaExec()

    this.validateConfig()
  }

  public setup = async (runnerKey: string) => {
    this.runnerKey = runnerKey

    const containerId = await this.kafkaExec.start(this.config, runnerKey)
    this.containerId = containerId

    await this.kafkaExec.checkHealth(this.config, runnerKey)
  }

  public teardown = async () => this.kafkaExec.teardown(this.containerId, this.runnerKey)

  private validateConfig = () => {
    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      zookeepeerConnect: validateTypes.isString,
      topics: validateTypes.isArrayOfType(validateTypes.isString),
    }

    const failures = validateTypes(schema, this.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }
}

export default KafkaRunner
