import execa from 'execa'

import { DockestError } from '../../errors'
import { acquireConnection, getContainerId, sleep } from '../../utils/execs'
import logger from '../../utils/logger'
import { teardownSingle } from '../../utils/teardown'
import { IZookeeperRunnerConfig } from './index'

interface IExec {
  start: (runnerConfig: IZookeeperRunnerConfig) => Promise<string>
  checkHealth: (runnerConfig: IZookeeperRunnerConfig) => Promise<void>
  teardown: (containerId: string, runnerKey: string) => Promise<void>
}

class ZookeeperExec implements IExec {
  private static instance: ZookeeperExec

  constructor() {
    if (ZookeeperExec.instance) {
      return ZookeeperExec.instance
    }

    ZookeeperExec.instance = this
  }

  public start = async (runnerConfig: IZookeeperRunnerConfig) => {
    logger.loading('Starting zookeeper container')

    const { port, service } = runnerConfig

    let containerId = await getContainerId(service)
    if (!containerId) {
      await execa.shell(`docker-compose run --detach --publish ${port}:2181 ${service}`)
      // const a = `docker-compose run --publish 8081:9082 --publish 9092:9092 --publish 9093:9093 --publish 9094:9094  -e kafka_hostname="" -e KAFKA_ADVERTISED_HOST_NAME="localhost" -e kafka_auto_create_topics_enable=true -e kafka_create_topics="Topic1:1:3,Topic2:1:1:compact" -e kafka_zookeeper_connect="zookeeper:2181" kafka`
    }
    containerId = await getContainerId(service)

    logger.success(`Zookeeper container started successfully`)

    return containerId
  }

  public checkHealth = async (runnerConfig: IZookeeperRunnerConfig) => {
    await this.checkConnection(runnerConfig)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkConnection = async (runnerConfig: IZookeeperRunnerConfig) => {
    logger.loading('Attempting to establish zookeeper connection')

    const { connectionTimeout = 30, port } = runnerConfig

    const recurse = async (connectionTimeout: number) => {
      logger.loading(`Establishing zookeeper connection (Timing out in: ${connectionTimeout}s)`)

      if (connectionTimeout <= 0) {
        throw new DockestError('Zookeeper connection timed out')
      }

      try {
        await acquireConnection(port)

        logger.success('Zookeeper connection established')
      } catch (error) {
        connectionTimeout--

        await sleep(1000)
        await recurse(connectionTimeout)
      }
    }

    await recurse(connectionTimeout)
  }
}

export default ZookeeperExec
