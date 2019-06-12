import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner from '../BaseRunner'
import { validateTypes } from '../utils'

interface RequiredConfigProps {
  service: string
  topics: string[]
  KAFKA_ZOOKEEPER_CONNECT: string
}
interface DefaultableConfigProps {
  connectionTimeout: number
  host: string
  port: number
  ports: { [key: string]: string | number }
  commands?: string[]
}
type KafkaRunnerConfig = RequiredConfigProps & DefaultableConfigProps
type KafkaRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

const DEFAULT_CONFIG: DefaultableConfigProps = {
  connectionTimeout: 30,
  host: 'localhost',
  port: 9092,
  ports: {
    // exposed : internal
    '9092': '9092',
    '9093': '9093',
    '9094': '9094',
  },
}

const createStartCommand = (runnerConfig: KafkaRunnerConfig): string => {
  const { host, ports, service, KAFKA_ZOOKEEPER_CONNECT } = runnerConfig

  const portMapping = Object.keys(ports).reduce((acc, port) => {
    const external = ports[port]
    const internal = port

    return `${acc} --publish ${external}:${internal}`
  }, '')

  // https://docs.confluent.io/current/installation/docker/config-reference.html#required-confluent-kafka-settings
  const env = ` \
                -e KAFKA_ZOOKEEPER_CONNECT=${KAFKA_ZOOKEEPER_CONNECT} \
                -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT \
                -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://${service}:29092,PLAINTEXT_HOST://${host}:9092 \
              `
  // SSL://${service}:29093,SSL_HOST://${host}:9093,\
  // SASL_SSL://${service}:29094,SASL_SSL_HOST://${host}:9094" \

  const cmd = ` \
                ${defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${env}
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
      KAFKA_ZOOKEEPER_CONNECT: validateTypes.isString,
    }
    this.validateConfig(schema, runnerConfig)
  }
}

export { KafkaRunnerConfig }
export default KafkaRunner
