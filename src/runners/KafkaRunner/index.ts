import RunnerLogger from '../../loggers/RunnerLogger'
import getKeyForVal from '../../utils/getKeyForVal'
import trim from '../../utils/trim'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import { BaseRunner, GetComposeService, Runner } from '../@types'
import { DEFAULT_CONFIG_VALUES } from '../constants'
import { ZooKeeperRunner } from '../index'
import getDependsOn from '../utils/getDependsOn'
import getImage from '../utils/getImage'
import getPorts from '../utils/getPorts'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  autoCreateTopic: boolean
  commands: string[]
  connectionTimeout: number
  dependsOn: Runner[]
  host: string
  image: string | undefined
  ports: {
    [key: string]: string
  }
}
type KafkaRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT_PLAINTEXT = '9092'
const DEFAULT_PORT_SASL_SSL = '9094'
const DEFAULT_PORT_SCHEMA_REGISTRY = '8081'
const DEFAULT_PORT_SSL = '9093'
const DEFAULT_CONFIG: DefaultableConfigProps = {
  autoCreateTopic: DEFAULT_CONFIG_VALUES.AUTO_CREATE_TOPIC,
  commands: DEFAULT_CONFIG_VALUES.COMMANDS,
  connectionTimeout: DEFAULT_CONFIG_VALUES.CONNECTION_TIMEOUT,
  dependsOn: DEFAULT_CONFIG_VALUES.DEPENDS_ON,
  host: DEFAULT_CONFIG_VALUES.HOST,
  image: DEFAULT_CONFIG_VALUES.IMAGE,
  ports: {
    [DEFAULT_PORT_PLAINTEXT]: DEFAULT_PORT_PLAINTEXT,
  },
}

class KafkaRunner implements BaseRunner {
  public static DEFAULT_HOST: string = DEFAULT_CONFIG_VALUES.HOST
  public static DEFAULT_PORT_PLAINTEXT: string = DEFAULT_PORT_PLAINTEXT
  public static DEFAULT_PORT_SASL_SSL: string = DEFAULT_PORT_SASL_SSL
  public static DEFAULT_PORT_SCHEMA_REGISTRY: string = DEFAULT_PORT_SCHEMA_REGISTRY // TODO: Move this to the Schemaregistry Runner once it's implemented
  public static DEFAULT_PORT_SSL: string = DEFAULT_PORT_SSL
  public containerId: string
  public runnerConfig: KafkaRunnerConfig
  public runnerLogger: RunnerLogger

  constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.containerId = ''
    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.runnerLogger = new RunnerLogger(this)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = composeFileName => {
    const { autoCreateTopic, dependsOn, image, ports, service } = this.runnerConfig

    const getZooKeeperConnect = (): { KAFKA_ZOOKEEPER_CONNECT: string } | {} => {
      const zooKeeperDependency = dependsOn.find(runner => runner instanceof ZooKeeperRunner)

      if (!zooKeeperDependency) {
        return {}
      }

      const exposedZooKeeperPort = getKeyForVal(
        zooKeeperDependency.runnerConfig.ports,
        ZooKeeperRunner.DEFAULT_PORT
      )

      return {
        KAFKA_ZOOKEEPER_CONNECT: `${zooKeeperDependency.runnerConfig.service}:${exposedZooKeeperPort}`,
      }
    }

    const getAdvertisedListeners = (): { KAFKA_ADVERTISED_LISTENERS: string } => {
      const exposedPlaintextPort = getKeyForVal(ports, DEFAULT_PORT_PLAINTEXT)
      const PLAINTEXT = !!exposedPlaintextPort
        ? `PLAINTEXT://${service}:2${exposedPlaintextPort}, PLAINTEXT_HOST://${DEFAULT_CONFIG_VALUES.HOST}:${exposedPlaintextPort}`
        : ''

      // TODO: Investigate exact behaviour for SSL & SASL_SSL
      const exposedSSLPort = getKeyForVal(ports, DEFAULT_PORT_SSL)
      const SSL = !!exposedSSLPort
        ? `, SSL://${service}:2${DEFAULT_PORT_SSL}, SSL_HOST://${DEFAULT_CONFIG_VALUES.HOST}:${exposedSSLPort}`
        : ''

      const exposedSASLSSLPort = getKeyForVal(ports, DEFAULT_PORT_SASL_SSL)
      const SASL_SSL = !!exposedSASLSSLPort
        ? `, SASL_SSL://${service}:2${DEFAULT_PORT_SASL_SSL}, SASL_SSL_HOST://${DEFAULT_CONFIG_VALUES.HOST}:${exposedSASLSSLPort}`
        : ''

      return {
        KAFKA_ADVERTISED_LISTENERS: trim(`${PLAINTEXT}${SSL}${SASL_SSL}`, ''),
      }
    }

    const getSecurityProtocolMap = (): { KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: string } => {
      const exposedPlaintextPort = !!getKeyForVal(ports, DEFAULT_PORT_PLAINTEXT)
      const PLAINTEXT = exposedPlaintextPort ? 'PLAINTEXT:PLAINTEXT, PLAINTEXT_HOST:PLAINTEXT' : ''

      const exposedSSLPort = !!getKeyForVal(ports, DEFAULT_PORT_SSL)
      const SSL = exposedSSLPort ? ', SSL:SSL, SSL_HOST:SSL' : ''

      const exposedSASLSSLPort = !!getKeyForVal(ports, DEFAULT_PORT_SASL_SSL)
      const SASL_SSL = exposedSASLSSLPort ? ', SASL_SSL:SASL_SSL, SASL_SSL_HOST:SASL_SSL' : ''

      return {
        KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: trim(`${PLAINTEXT}${SSL}${SASL_SSL}`, ''),
      }
    }

    return {
      [service]: {
        environment: {
          // https://docs.confluent.io/current/installation/docker/config-reference.html#required-confluent-kafka-settings
          ...getZooKeeperConnect(),

          ...getAdvertisedListeners(),
          ...getSecurityProtocolMap(),

          KAFKA_AUTO_CREATE_TOPICS_ENABLE: !!autoCreateTopic ? 'true' : 'false',
          KAFKA_BROKER_ID: 1,
          KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1,
        },
        ...getDependsOn(dependsOn),
        ...getImage({ image, composeFileName, service }),
        ...getPorts(ports),
      },
    }
  }
}

export { KafkaRunnerConfig }
export default KafkaRunner

/**
 * Possible TODO: Create topic through bash
 */
// await execa(
//   `docker exec ${
//     // @ts-ignore
//     config.runners.find(runner => runner instanceof KafkaRunner).containerId
//   } bash -c "kafka-topics --create --if-not-exists --topic dockesttopic --replication-factor 1 --partitions 1 --zookeeper zookeeper1confluentinc:2181"`
// )

/**
 * TODO: SSL & SASL_SSL
 */
// [DEFAULT_PORT_SSL]: DEFAULT_PORT_SSL,
// [DEFAULT_PORT_SASL_SSL]: DEFAULT_PORT_SASL_SSL,
// const DEFAULT_PORT_SSL = 9093
// const DEFAULT_PORT_SASL_SSL = 9094
// SSL://${service}:29093,SSL_HOST://${host}:${DEFAULT_PORT_SSL},\
// SASL_SSL://${service}:29094,SASL_SSL_HOST://${host}:${DEFAULT_PORT_SASL_SSL}" \
