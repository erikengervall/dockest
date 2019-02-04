import execa from 'execa'

import { defaultDockerComposeRunOpts } from '../../constants'
import { DockestError } from '../../errors'
import { execLogger, globalLogger } from '../../loggers'
import { acquireConnection, getContainerId, sleep } from '../../utils/execs'
import { teardownSingle } from '../../utils/teardown'
import { IKafkaRunnerConfig } from './index'

interface IExec {
  start: (runnerConfig: IKafkaRunnerConfig, runnerKey: string) => Promise<string>
  checkHealth: (runnerConfig: IKafkaRunnerConfig, runnerKey: string) => Promise<void>
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

  public start = async (runnerConfig: IKafkaRunnerConfig, runnerKey: string) => {
    execLogger.setup.startContainer(runnerKey)

    const { ports, service, topics, autoCreateTopics, zookeepeerConnect } = runnerConfig

    let containerId = await getContainerId(service)
    if (!containerId) {
      const portMapping = Object.keys(ports)
        .map(port => `--publish ${ports[port]}:${port}`)
        .join(' ')
      const env = ` -e KAFKA_ADVERTISED_HOST_NAME="localhost" \
                    ${`-e KAFKA_AUTO_CREATE_TOPICS_ENABLE=${autoCreateTopics}`} \
                    ${topics.length ? `-e KAFKA_CREATE_TOPICS="${topics.join(',')}"` : ''} \
                    ${`-e KAFKA_ZOOKEEPER_CONNECT="${zookeepeerConnect}"`}`
      const cmd = `docker-compose run \
                    ${defaultDockerComposeRunOpts} \
                    ${portMapping} \
                    ${env} \
                    ${service}`
      globalLogger.shellCmd(cmd)
      await execa.shell(cmd)
    }
    containerId = await getContainerId(service)

    execLogger.setup.startContainerSuccess(service)

    return containerId
  }

  public checkHealth = async (runnerConfig: IKafkaRunnerConfig, runnerKey: string) => {
    execLogger.health.checkHealth(runnerKey)

    await this.checkConnection(runnerConfig, runnerKey)

    execLogger.health.checkHealthSuccess(runnerKey)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkConnection = async (runnerConfig: IKafkaRunnerConfig, runnerKey: string) => {
    const { connectionTimeout = 30, ports } = runnerConfig

    const primaryKafkaPort = Number(
      Object.keys(ports).find(port => ports[port] === PRIMARY_KAFKA_PORT)
    )

    const recurse = async (connectionTimeout: number) => {
      execLogger.health.checkConnection(runnerKey, connectionTimeout)

      if (connectionTimeout <= 0) {
        throw new DockestError('Kafka connection timed out')
      }

      try {
        await acquireConnection(primaryKafkaPort)

        execLogger.health.checkConnectionSuccess(runnerKey)
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
