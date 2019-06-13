import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner from '../BaseRunner'
import { getImage, trimmer, validateConfig, validateTypes } from '../utils'

interface RequiredConfigProps {
  service: string
  topics: string[]
}
interface DefaultableConfigProps {
  connectionTimeout: number
  host: string
  ports: { [key: string]: string | number }
  commands?: string[]
  dependsOn?: any
}
type KafkaRunnerConfig = RequiredConfigProps & DefaultableConfigProps
type KafkaRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

/**
 * TODO: SSL & SASL_SSL
 */
// [DEFAULT_INTERNAL_PORT_SSL]: DEFAULT_INTERNAL_PORT_SSL,
// [DEFAULT_INTERNAL_PORT_SASL_SSL]: DEFAULT_INTERNAL_PORT_SASL_SSL,
// const DEFAULT_INTERNAL_PORT_SSL = 9093
// const DEFAULT_INTERNAL_PORT_SASL_SSL = 9094
// SSL://${service}:29093,SSL_HOST://${host}:${DEFAULT_INTERNAL_PORT_SSL},\
// SASL_SSL://${service}:29094,SASL_SSL_HOST://${host}:${DEFAULT_INTERNAL_PORT_SASL_SSL" \

const DEFAULT_INTERNAL_PORT_PLAINTEXT = 9092
const DEFAULT_CONFIG: DefaultableConfigProps = {
  connectionTimeout: 30,
  host: 'localhost',
  ports: {
    [DEFAULT_INTERNAL_PORT_PLAINTEXT]: DEFAULT_INTERNAL_PORT_PLAINTEXT,
  },
}

const getComposeService = (
  runnerConfig: KafkaRunnerConfig,
  dockerComposeFileName: string
): object => {
  const {
    service,
    ports,
    dependsOn: {
      runnerConfig: { service: depService, port: depPort },
    },
  } = runnerConfig

  return {
    [service]: {
      image: getImage(service, dockerComposeFileName),
      depends_on: [depService],
      ports: [`${ports[DEFAULT_INTERNAL_PORT_PLAINTEXT]}:${DEFAULT_INTERNAL_PORT_PLAINTEXT}`],
      environment: {
        // https://docs.confluent.io/current/installation/docker/config-reference.html#required-confluent-kafka-settings
        KAFKA_ZOOKEEPER_CONNECT: `${depService}:${depPort}`,
        KAFKA_ADVERTISED_LISTENERS: `PLAINTEXT://${service}:29092,PLAINTEXT_HOST://localhost:${DEFAULT_INTERNAL_PORT_PLAINTEXT}`,

        KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT',
      },
    },
  }
}

/**
 * DEPRECATED
 */
// const getComposeRunCommand = (runnerConfig: KafkaRunnerConfig): string => {
//   const { host, ports, service } = runnerConfig

//   const portMapping = Object.keys(ports).reduce((acc, port) => {
//     const external = ports[port]
//     const internal = port

//     return `${acc} --publish ${external}:${internal}`
//   }, '')

//   const env = ` \
//                 -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT \
//                 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://${service}:29092,PLAINTEXT_HOST://${host}:9092 \
//               `

//   const cmd = ` \
//                 ${defaultDockerComposeRunOpts} \
//                 ${portMapping} \
//                 ${env}
//                 ${service} \
//               `

//   return trimmer(cmd)
// }

class KafkaRunner extends BaseRunner {
  constructor(config: KafkaRunnerConfigUserInput) {
    const runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    const runnerCommandFactories = {
      getComposeService,
    }

    super(runnerConfig, runnerCommandFactories)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      topics: validateTypes.isArrayOfType(validateTypes.isString),
      // KAFKA_ZOOKEEPER_CONNECT: validateTypes.isString,
    }
    validateConfig(schema, runnerConfig)
  }
}

export { KafkaRunnerConfig }
export default KafkaRunner
