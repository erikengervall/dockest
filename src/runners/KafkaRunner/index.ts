import { BaseRunner, GetComposeService, SharedDefaultableConfigProps, SharedRequiredConfigProps } from '../@types'
import { SHARED_DEFAULT_CONFIG_PROPS } from '../constants'
import { ZooKeeperRunner } from '../index'
import Logger from '../../Logger'
import trim from '../../utils/trim'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import composeFileHelper from '../composeFileHelper'

interface RequiredConfigProps extends SharedRequiredConfigProps {}
interface DefaultableConfigProps extends SharedDefaultableConfigProps {
  autoCreateTopic: boolean
}
interface KafkaRunnerConfig extends RequiredConfigProps, DefaultableConfigProps {}

const DEFAULT_PORT_PLAINTEXT = 9092
const DEFAULT_PORT_SASL_SSL = 9094
const DEFAULT_PORT_SCHEMA_REGISTRY = 8081
const DEFAULT_PORT_SSL = 9093
const DEFAULT_AUTO_CREATE_TOPIC = true
const DEFAULT_CONFIG: DefaultableConfigProps = {
  ...SHARED_DEFAULT_CONFIG_PROPS,
  autoCreateTopic: DEFAULT_AUTO_CREATE_TOPIC,
  ports: [
    {
      published: DEFAULT_PORT_PLAINTEXT,
      target: DEFAULT_PORT_PLAINTEXT,
    },
  ],
}

class KafkaRunner implements BaseRunner {
  public static DEFAULT_HOST = SHARED_DEFAULT_CONFIG_PROPS.host
  public static DEFAULT_PORT_PLAINTEXT = DEFAULT_PORT_PLAINTEXT
  public static DEFAULT_PORT_SASL_SSL = DEFAULT_PORT_SASL_SSL
  public static DEFAULT_PORT_SCHEMA_REGISTRY = DEFAULT_PORT_SCHEMA_REGISTRY // TODO: Move this to the Schemaregistry Runner once it's implemented
  public static DEFAULT_PORT_SSL = DEFAULT_PORT_SSL
  public containerId = ''
  public initializer = ''
  public runnerConfig: KafkaRunnerConfig
  public logger: Logger

  public constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.logger = new Logger(this)
  }

  public validateConfig() {
    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = () => {
    const { autoCreateTopic, dependsOn, ports, service } = this.runnerConfig

    const getZooKeeperConnect = (): { KAFKA_ZOOKEEPER_CONNECT: string } | {} => {
      const zooKeeperDependency = dependsOn.find(runner => runner instanceof ZooKeeperRunner)

      if (!zooKeeperDependency) {
        return {}
      }

      const exposedZooKeeperPortBinding = zooKeeperDependency.runnerConfig.ports.find(
        portBinding => portBinding.published === ZooKeeperRunner.DEFAULT_PORT,
      )
      const port = exposedZooKeeperPortBinding ? exposedZooKeeperPortBinding.published : undefined

      return {
        KAFKA_ZOOKEEPER_CONNECT: `${zooKeeperDependency.runnerConfig.service}:${port}`,
      }
    }

    const getAdvertisedListeners = (): { KAFKA_ADVERTISED_LISTENERS: string } => {
      const exposedPlaintextPortBinding = ports.find(portBinding => portBinding.target === DEFAULT_PORT_PLAINTEXT)

      const PLAINTEXT = !!exposedPlaintextPortBinding
        ? `PLAINTEXT://${service}:2${exposedPlaintextPortBinding.published}, PLAINTEXT_HOST://${SHARED_DEFAULT_CONFIG_PROPS.host}:${exposedPlaintextPortBinding.published}`
        : ''

      // TODO: Investigate exact behaviour for SSL & SASL_SSL
      const exposedSSLPortBinding = ports.find(portBinding => portBinding.target === DEFAULT_PORT_SSL)
      const SSL = !!exposedSSLPortBinding
        ? `, SSL://${service}:2${DEFAULT_PORT_SSL}, SSL_HOST://${SHARED_DEFAULT_CONFIG_PROPS.host}:${exposedSSLPortBinding.published}`
        : ''

      const exposedSASLSSLPortBinding = ports.find(portBinding => portBinding.target === DEFAULT_PORT_SASL_SSL)
      const SASL_SSL = !!exposedSASLSSLPortBinding
        ? `, SASL_SSL://${service}:2${DEFAULT_PORT_SASL_SSL}, SASL_SSL_HOST://${SHARED_DEFAULT_CONFIG_PROPS.host}:${exposedSASLSSLPortBinding.published}`
        : ''

      return {
        KAFKA_ADVERTISED_LISTENERS: trim(`${PLAINTEXT}${SSL}${SASL_SSL}`, ''),
      }
    }

    const getSecurityProtocolMap = (): { KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: string } => {
      const exposedPlaintextPort = !!ports.find(portBinding => portBinding.target === DEFAULT_PORT_PLAINTEXT)
      const PLAINTEXT = exposedPlaintextPort ? 'PLAINTEXT:PLAINTEXT, PLAINTEXT_HOST:PLAINTEXT' : ''

      const exposedSSLPort = !!ports.find(portBinding => portBinding.target === DEFAULT_PORT_SSL)
      const SSL = exposedSSLPort ? ', SSL:SSL, SSL_HOST:SSL' : ''

      const exposedSASLSSLPort = !!ports.find(portBinding => portBinding.target === DEFAULT_PORT_SASL_SSL)
      const SASL_SSL = exposedSASLSSLPort ? ', SASL_SSL:SASL_SSL, SASL_SSL_HOST:SASL_SSL' : ''

      return {
        KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: trim(`${PLAINTEXT}${SSL}${SASL_SSL}`, ''),
      }
    }

    return {
      environment: {
        // https://docs.confluent.io/current/installation/docker/config-reference.html#required-confluent-kafka-settings
        ...getZooKeeperConnect(),

        ...getAdvertisedListeners(),
        ...getSecurityProtocolMap(),

        KAFKA_AUTO_CREATE_TOPICS_ENABLE: autoCreateTopic ? 'true' : 'false',
        KAFKA_BROKER_ID: 1,
        KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1,
      },
      ...composeFileHelper(this.runnerConfig), // Since this also returns `...props`, it could overwrite `environment`
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
