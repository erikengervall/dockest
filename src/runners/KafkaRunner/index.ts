import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner from '../BaseRunner'
import { validateTypes } from '../utils'

interface RequiredConfigProps {
  service: string
  image: string
  topics: string[]
}
interface DefaultableConfigProps {
  connectionTimeout: number
  host: string
  port: number
  ports: { [key: string]: string | number }
  commands?: string[]
  dependsOn?: any
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

const createComposeService = (runnerConfig: KafkaRunnerConfig): object => {
  const {
    service,
    image,
    dependsOn: {
      runnerConfig: { service: depService, port: depPort },
    },
  } = runnerConfig

  return {
    [service]: {
      image,
      depends_on: [depService],
      ports: ['9092:9092', '9093:9093', '9094:9094'],
      environment: {
        KAFKA_ZOOKEEPER_CONNECT: `${depService}:${depPort}`,
        KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT',
        KAFKA_ADVERTISED_LISTENERS: `PLAINTEXT://${service}:29092,PLAINTEXT_HOST://localhost:9092`,
      },
    },
  }
}

const createStartCommand = (runnerConfig: KafkaRunnerConfig): string => {
  const { host, ports, service } = runnerConfig

  const portMapping = Object.keys(ports).reduce((acc, port) => {
    const external = ports[port]
    const internal = port

    return `${acc} --publish ${external}:${internal}`
  }, '')

  // https://docs.confluent.io/current/installation/docker/config-reference.html#required-confluent-kafka-settings
  const env = ` \
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
      createComposeService,
    }
    const runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    super(runnerConfig, commandCreators)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      image: validateTypes.isString,
      topics: validateTypes.isArrayOfType(validateTypes.isString),
      // KAFKA_ZOOKEEPER_CONNECT: validateTypes.isString,
    }
    this.validateConfig(schema, runnerConfig)
  }
}

export { KafkaRunnerConfig }
export default KafkaRunner
