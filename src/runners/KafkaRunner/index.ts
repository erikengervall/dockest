import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner from '../BaseRunner'
import { validateTypes } from '../utils'

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
type KafkaRunnerConfig = RequiredConfigProps & DefaultableConfigProps
type KafkaRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: 'localhost',
  ports: { '9092': '9092', '9093': '9093', '9094': '9094' },
  autoCreateTopics: true,
  commands: [],
  connectionTimeout: 30,
}

const createStartCommand = (runnerConfig: KafkaRunnerConfig): string => {
  const { ports, service, topics, autoCreateTopics, zookeepeerConnect } = runnerConfig

  const portMapping = Object.keys(ports)
    .map(port => `--publish ${ports[port]}:${port}`)
    .join(' ')
  const env = ` -e KAFKA_ADVERTISED_HOST_NAME="localhost" \
              ${`-e KAFKA_AUTO_CREATE_TOPICS_ENABLE=${autoCreateTopics}`} \
              ${topics.length ? `-e KAFKA_CREATE_TOPICS="${topics.join(',')}"` : ''} \
              ${`-e KAFKA_ZOOKEEPER_CONNECT="${zookeepeerConnect}"`}`
  const cmd = `docker-compose run \
              ${defaultDockerComposeRunOpts} \
              ${portMapping} \
              ${env} \
              ${service}`

  return cmd.replace(/\s+/g, ' ').trim()
}

class KafkaRunner extends BaseRunner {
  constructor(config: KafkaRunnerConfigUserInput) {
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
      zookeepeerConnect: validateTypes.isString,
      topics: validateTypes.isArrayOfType(validateTypes.isString),
    }
    this.validateConfig(schema, runnerConfig)
  }
}

export { KafkaRunnerConfig }
export default KafkaRunner
