import execa from 'execa'

import { defaultDockerComposeRunOpts } from '../../constants'
import { DockestError } from '../../errors'
import { RunnerLogger } from '../../loggers'
import { acquireConnection, getContainerId, sleep, teardownSingle } from '../utils'
import { IKafkaRunnerConfig } from './index'

interface IExec {
  start: (runnerConfig: IKafkaRunnerConfig, runnerKey: string) => Promise<string>
  checkHealth: (runnerConfig: IKafkaRunnerConfig, runnerKey: string) => Promise<void>
  teardown: (containerId: string, runnerKey: string) => Promise<void>
}

class KafkaExec implements IExec {
  private static instance: KafkaExec

  constructor() {
    return KafkaExec.instance || (KafkaExec.instance = this)
  }

  public start = async (runnerConfig: IKafkaRunnerConfig, runnerKey: string) => {
    RunnerLogger.startContainer(runnerKey)

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
      RunnerLogger.shellCmd(cmd)
      await execa.shell(cmd)
    }
    containerId = await getContainerId(service)

    RunnerLogger.startContainerSuccess(service)

    return containerId
  }

  public checkHealth = async (runnerConfig: IKafkaRunnerConfig, runnerKey: string) => {
    RunnerLogger.checkHealth(runnerKey)

    await this.checkConnection(runnerConfig, runnerKey)

    RunnerLogger.checkHealthSuccess(runnerKey)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkConnection = async (runnerConfig: IKafkaRunnerConfig, runnerKey: string) => {
    const { connectionTimeout, ports } = runnerConfig

    const PRIMARY_KAFKA_PORT = '9092'
    const primaryKafkaPort = Number(
      Object.keys(ports).find(port => ports[port] === PRIMARY_KAFKA_PORT)
    )

    const recurse = async (connectionTimeout: number) => {
      RunnerLogger.checkConnection(runnerKey, connectionTimeout)

      if (connectionTimeout <= 0) {
        throw new DockestError('Kafka connection timed out')
      }

      try {
        await acquireConnection(primaryKafkaPort)

        RunnerLogger.checkConnectionSuccess(runnerKey)
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
