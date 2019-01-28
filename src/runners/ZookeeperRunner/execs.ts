import execa from 'execa'

import { defaultDockerComposeRunOpts } from '../../constants'
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
      const portMapping = `--publish ${port}:2181`
      const cmd = `docker-compose run \
                  ${defaultDockerComposeRunOpts} \
                  ${portMapping} \
                  ${service}`
      logger.command(cmd)
      await execa.shell(cmd)
    }
    containerId = await getContainerId(service)

    logger.success(`Zookeeper container started successfully (${containerId})`)

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
