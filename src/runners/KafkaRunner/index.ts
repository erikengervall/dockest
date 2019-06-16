import { DEFAULT_CONNECTION_TIMEOUT, DEFAULT_HOST } from '../../constants'
import { getImage, validateConfig, validateTypes } from '../../utils'
import BaseRunner, { runnerMethods } from '../BaseRunner'
import { Runner, ZooKeeperRunner } from '../index'

interface RequiredConfigProps {
  service: string
  dependsOn: Runner[]
}
interface DefaultableConfigProps {
  host: string
  port: number
  ports: { [key: number]: number }
  commands: string[]
  connectionTimeout: number
  autoCreateTopic: boolean
  deleteTopic: boolean
}
type KafkaRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT_PLAINTEXT = 9092
const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: DEFAULT_HOST,
  port: DEFAULT_PORT_PLAINTEXT,
  ports: {
    [DEFAULT_PORT_PLAINTEXT]: DEFAULT_PORT_PLAINTEXT,
  },
  commands: [],
  connectionTimeout: DEFAULT_CONNECTION_TIMEOUT,
  autoCreateTopic: true,
  deleteTopic: true,
}

class KafkaRunner extends BaseRunner {
  public runnerConfig: KafkaRunnerConfig
  public runnerMethods: runnerMethods

  constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    super()

    this.runnerMethods = {
      getComposeService: this.getComposeService,
    }
    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      dependsOn: validateTypes.isArray,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService = (dockerComposeFileName: string) => {
    const { service, ports, dependsOn, autoCreateTopic, deleteTopic } = this.runnerConfig

    const zkDep = dependsOn.find(runner => runner instanceof ZooKeeperRunner)
    if (!zkDep) {
      throw new Error('Gotta have that zookeeperdep') // TODO: Proper naming
    }
    const {
      runnerConfig: { service: zkService, port: zkPort },
    } = zkDep

    return {
      [service]: {
        image: getImage(service, dockerComposeFileName),
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
//                 ${portMapping} \
//                 ${env}
//                 ${service} \
//               `

//   return trimmer(cmd)
// }
