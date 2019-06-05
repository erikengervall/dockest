import ip from 'ip'
import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner from '../BaseRunner'
import { validateTypes } from '../utils'

interface RequiredConfigProps {
  service: string
  topics: string[]
}
interface DefaultableConfigProps {
  autoCreateTopics: boolean
  connectionTimeout: number
  host: string
  port: number
  ports: { [key: string]: string | number }
  zookeepeerConnect: string
}
type KafkaRunnerConfig = RequiredConfigProps & DefaultableConfigProps
type KafkaRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

const DEFAULT_CONFIG: DefaultableConfigProps = {
  autoCreateTopics: true,
  connectionTimeout: 30,
  host: 'localhost',
  port: 9092,
  ports: {
    // exposed : internal
    '9092': '9092', // Kafka: https://hub.docker.com/r/wurstmeister/kafka
    '9093': '9093', // --||--
    '9094': '9094', // --||--
    '8081': `9082`, // Schema registry: https://hub.docker.com/r/confluentinc/cp-schema-registry
    '2181': '2181', // Zookeeper: https://hub.docker.com/_/zookeeper
  },
  zookeepeerConnect: '',
}

const createStartCommand = (runnerConfig: KafkaRunnerConfig): string => {
  const { ports, service, topics, autoCreateTopics, zookeepeerConnect } = runnerConfig

  const portMapping = Object.keys(ports).reduce(
    (acc, port) => `${acc} --publish ${ports[port]}:${port}`,
    ''
  )
  const env = ` \
                -e KAFKA_ADVERTISED_HOST_NAME=${ip.address()} \
                ${`-e KAFKA_AUTO_CREATE_TOPICS_ENABLE=${autoCreateTopics}`} \
                ${topics.length ? `-e KAFKA_CREATE_TOPICS="${topics.join(',')}"` : ''} \
                ${!!zookeepeerConnect ? `-e KAFKA_ZOOKEEPER_CONNECT="${zookeepeerConnect}"` : ''} \
              `
  const cmd = ` \
                docker-compose run \
                ${defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${env} \
                ${service} \
              `

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
      topics: validateTypes.isArrayOfType(validateTypes.isString),
    }
    this.validateConfig(schema, runnerConfig)
  }
}

export { KafkaRunnerConfig }
export default KafkaRunner
