import execa from 'execa'

import { defaultDockerComposeRunOpts } from '../../constants'
import { DockestError } from '../../errors'
import { RunnerLogger } from '../../loggers'
import { acquireConnection, getContainerId, sleep, teardownSingle } from '../utils'
import { ZookeeperRunnerConfig } from './index'

interface Exec {
  start: (runnerConfig: ZookeeperRunnerConfig, runnerKey: string) => Promise<string>
  checkHealth: (runnerConfig: ZookeeperRunnerConfig, runnerKey: string) => Promise<void>
  teardown: (containerId: string, runnerKey: string) => Promise<void>
}

class ZookeeperExec implements Exec {
  private static instance: ZookeeperExec

  constructor() {
    return ZookeeperExec.instance || (ZookeeperExec.instance = this)
  }

  public start = async (runnerConfig: ZookeeperRunnerConfig, runnerKey: string) => {
    RunnerLogger.startContainer(runnerKey)

    const { port, service } = runnerConfig

    let containerId = await getContainerId(service)
    if (!containerId) {
      const portMapping = `--publish ${port}:2181`
      const cmd = `docker-compose run \
                    ${defaultDockerComposeRunOpts} \
                    ${portMapping} \
                    ${service}`
      RunnerLogger.shellCmd(cmd)
      await execa.shell(cmd)
    }
    containerId = await getContainerId(service)

    RunnerLogger.startContainerSuccess(service)

    return containerId
  }

  public checkHealth = async (runnerConfig: ZookeeperRunnerConfig, runnerKey: string) => {
    RunnerLogger.checkHealth(runnerKey)

    await this.checkConnection(runnerConfig, runnerKey)

    RunnerLogger.checkHealthSuccess(runnerKey)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkConnection = async (runnerConfig: ZookeeperRunnerConfig, runnerKey: string) => {
    const { connectionTimeout, port } = runnerConfig

    const recurse = async (connectionTimeout: number) => {
      RunnerLogger.checkConnection(runnerKey, connectionTimeout)

      if (connectionTimeout <= 0) {
        throw new DockestError('Zookeeper connection timed out')
      }

      try {
        await acquireConnection(port)

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

export default ZookeeperExec
