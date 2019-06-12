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
  commands?: string[]
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
    '9092': '9092', // Kafka
    // '9093': '9093', // Kafka
    // '9094': '9094', // Kafka
    // '8081': `9082`, // Schema registry
    '2181': `2181`, // Zookeeper
  },
}

const createStartCommand = (runnerConfig: KafkaRunnerConfig): string => {
  const { ports, service } = runnerConfig

  const portMapping = Object.keys(ports).reduce(
    (acc, port) => `${acc} --publish ${ports[port]}:${port}`,
    ''
  )
  const env = ` \
                -e ADVERTISED_HOST=${ip.address()} \
                -e ADVERTISED_PORT=${'9092'} \
                -e TOPICS=mytopic \
              `

  // docker run -p 2181:2181 -p 9092:9092 --env ADVERTISED_HOST=`docker-machine ip \`docker-machine active\`` --env ADVERTISED_PORT=9092 spotify/kafka

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
