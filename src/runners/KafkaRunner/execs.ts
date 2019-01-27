import execa from 'execa'

// import fs from 'fs'
import { DockestError } from '../../errors'
import { acquireConnection, getContainerId, sleep } from '../../utils/execs'
import logger from '../../utils/logger'
import { teardownSingle } from '../../utils/teardown'
import { IKafkaRunnerConfig } from './index'

interface IExec {
  start: (runnerConfig: IKafkaRunnerConfig) => Promise<string>
  checkHealth: (runnerConfig: IKafkaRunnerConfig) => Promise<void>
  teardown: (containerId: string, runnerKey: string) => Promise<void>
}

const PRIMARY_KAFKA_PORT = '9092'

class KafkaExec implements IExec {
  private static instance: KafkaExec

  constructor() {
    if (KafkaExec.instance) {
      return KafkaExec.instance
    }

    KafkaExec.instance = this
  }

  public start = async (runnerConfig: IKafkaRunnerConfig) => {
    logger.loading('Starting kafka container')

    const { ports, service, topics, autoCreateTopics, zookeepeerConnect } = runnerConfig

    let containerId = await getContainerId(service)
    if (!containerId) {
      const stringifiedPorts = Object.keys(ports)
        .map(port => `--publish ${ports[port]}:${port}`)
        .join(' ')
      const envTopics = topics.length ? `-e KAFKA_CREATE_TOPICS="${topics.join(',')}"` : ''
      const envAutoCreateTopics = `-e KAFKA_AUTO_CREATE_TOPICS_ENABLE=${autoCreateTopics}`
      const envZookeepeerConnect = `-e KAFKA_ZOOKEEPER_CONNECT="${zookeepeerConnect}"`
      const env = ` -e KAFKA_ADVERTISED_HOST_NAME="localhost" \
                    ${envAutoCreateTopics} \
                    ${envTopics} \
                    ${'' || envZookeepeerConnect}`
      await execa.shell(`docker-compose run --detach ${stringifiedPorts} ${env} ${service}`)
    }
    containerId = await getContainerId(service)

    logger.success(`Kafka container started successfully`)

    return containerId
  }

  public checkHealth = async (runnerConfig: IKafkaRunnerConfig) => {
    await this.checkConnection(runnerConfig)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkConnection = async (runnerConfig: IKafkaRunnerConfig) => {
    logger.loading('Attempting to establish Kafka connection')

    const { connectionTimeout = 30, ports } = runnerConfig

    const primaryKafkaPort = Number(
      Object.keys(ports).find(port => ports[port] === PRIMARY_KAFKA_PORT)
    )

    const recurse = async (connectionTimeout: number) => {
      logger.loading(`Establishing Kafka connection (Timing out in: ${connectionTimeout}s)`)

      if (connectionTimeout <= 0) {
        throw new DockestError('Kafka connection timed out')
      }

      try {
        await acquireConnection(primaryKafkaPort)

        logger.success('Kafka connection established')
      } catch (error) {
        connectionTimeout--

        await sleep(1000)
        await recurse(connectionTimeout)
      }
    }

    await recurse(connectionTimeout)
  }
}

export default KafkaExec
