import { DEFAULT_CONFIG_VALUES } from '../../constants'
import { ConfigurationError } from '../../errors'
import { RunnerLogger } from '../../loggers'
import { getImage, validateConfig, validateTypes } from '../../utils'
import { GetComposeService, Runner } from '../@types'
import { ZooKeeperRunner } from '../index'

interface RequiredConfigProps {
  dependsOn: Runner[]
  service: string
}
interface DefaultableConfigProps {
  autoCreateTopic: boolean
  commands: string[]
  connectionTimeout: number
  deleteTopic: boolean
  host: string
  image: string | undefined
  port: number
  ports: { [key: number]: number }
}
type KafkaRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT_PLAINTEXT = 9092
const DEFAULT_CONFIG: DefaultableConfigProps = {
  autoCreateTopic: true,
  commands: [],
  connectionTimeout: DEFAULT_CONFIG_VALUES.CONNECTION_TIMEOUT,
  deleteTopic: true,
  host: DEFAULT_CONFIG_VALUES.HOST,
  image: undefined,
  port: DEFAULT_PORT_PLAINTEXT,
  ports: { [DEFAULT_PORT_PLAINTEXT]: DEFAULT_PORT_PLAINTEXT },
}

class KafkaRunner {
  public runnerConfig: KafkaRunnerConfig
  public runnerLogger: RunnerLogger
  public containerId: string

  constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.runnerConfig = { ...DEFAULT_CONFIG, ...config }
    this.runnerLogger = new RunnerLogger(this)
    this.containerId = ''

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      dependsOn: validateTypes.isArray,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = dockerComposeFileName => {
    const { image, deleteTopic, autoCreateTopic, dependsOn, ports, service } = this.runnerConfig

    const zkDep = dependsOn.find(runner => runner instanceof ZooKeeperRunner)
    if (!zkDep) {
      throw new ConfigurationError('Missing required ZooKeeper dependency')
    }
    const {
      runnerConfig: { service: zkService, port: zkPort },
    } = zkDep

    return {
      [service]: {
        image: getImage({ image, dockerComposeFileName, service }),
        depends_on: dependsOn.map(({ runnerConfig: { service } }) => service),
        ports: [`${ports[DEFAULT_PORT_PLAINTEXT]}:${DEFAULT_PORT_PLAINTEXT}`],
        environment: {
          // https://docs.confluent.io/current/installation/docker/config-reference.html#required-confluent-kafka-settings
          KAFKA_ZOOKEEPER_CONNECT: `${zkService}:${zkPort}`,
          KAFKA_ADVERTISED_LISTENERS: `PLAINTEXT://${service}:29092,PLAINTEXT_HOST://localhost:${DEFAULT_PORT_PLAINTEXT}`,

          KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT',

          KAFKA_AUTO_CREATE_TOPICS_ENABLE: !!autoCreateTopic ? 'true' : 'false',
          KAFKA_DELETE_TOPIC_ENABLE: !!deleteTopic ? 'true' : 'false',

          KAFKA_BROKER_ID: 1,
          KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1,
        },
      },
    }
  }
}

export { KafkaRunnerConfig }
export default KafkaRunner

/**
 * TODO: SSL & SASL_SSL
 */
// [DEFAULT_INTERNAL_PORT_SSL]: DEFAULT_INTERNAL_PORT_SSL,
// [DEFAULT_INTERNAL_PORT_SASL_SSL]: DEFAULT_INTERNAL_PORT_SASL_SSL,
// const DEFAULT_INTERNAL_PORT_SSL = 9093
// const DEFAULT_INTERNAL_PORT_SASL_SSL = 9094
// SSL://${service}:29093,SSL_HOST://${host}:${DEFAULT_INTERNAL_PORT_SSL},\
// SASL_SSL://${service}:29094,SASL_SSL_HOST://${host}:${DEFAULT_INTERNAL_PORT_SASL_SSL" \
