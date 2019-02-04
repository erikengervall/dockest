import execa from 'execa'

import { defaultDockerComposeRunOpts } from '../../constants'
import { DockestError } from '../../errors'
import { execLogger, globalLogger } from '../../loggers'
import { acquireConnection, getContainerId, sleep } from '../../utils/execs'
import { teardownSingle } from '../../utils/teardown'
import { IZookeeperRunnerConfig } from './index'

interface IExec {
  start: (runnerConfig: IZookeeperRunnerConfig, runnerKey: string) => Promise<string>
  checkHealth: (runnerConfig: IZookeeperRunnerConfig, runnerKey: string) => Promise<void>
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

  public start = async (runnerConfig: IZookeeperRunnerConfig, runnerKey: string) => {
    execLogger.setup.startContainer(runnerKey)

    const { port, service } = runnerConfig

    let containerId = await getContainerId(service)
    if (!containerId) {
      const portMapping = `--publish ${port}:2181`
      const cmd = `docker-compose run \
                    ${defaultDockerComposeRunOpts} \
                    ${portMapping} \
                    ${service}`
      globalLogger.shellCmd(cmd)
      await execa.shell(cmd)
    }
    containerId = await getContainerId(service)

    execLogger.setup.startContainerSuccess(service)

    return containerId
  }

  public checkHealth = async (runnerConfig: IZookeeperRunnerConfig, runnerKey: string) => {
    execLogger.health.checkHealth(runnerKey)

    await this.checkConnection(runnerConfig, runnerKey)

    execLogger.health.checkHealthSuccess(runnerKey)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkConnection = async (runnerConfig: IZookeeperRunnerConfig, runnerKey: string) => {
    const { connectionTimeout = 30, port } = runnerConfig

    const recurse = async (connectionTimeout: number) => {
      execLogger.health.checkConnection(runnerKey, connectionTimeout)

      if (connectionTimeout <= 0) {
        throw new DockestError('Zookeeper connection timed out')
      }

      try {
        await acquireConnection(port)

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

export default ZookeeperExec
