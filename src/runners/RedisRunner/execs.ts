import execa from 'execa'
import { defaultDockerComposeRunOpts } from '../../constants'
import { DockestError } from '../../errors'
import { RunnerLogger } from '../../loggers'
import { acquireConnection, getContainerId, sleep, teardownSingle } from '../utils'
import { IRedisRunnerConfig } from './index'

interface IExec {
  start: (runnerConfig: IRedisRunnerConfig, runnerKey: string) => Promise<string>
  checkHealth: (
    runnerConfig: IRedisRunnerConfig,
    containerId: string,
    runnerKey: string
  ) => Promise<void>
  teardown: (containerId: string, runnerKey: string) => Promise<void>
}

class RedisExec implements IExec {
  private static instance: RedisExec

  constructor() {
    return RedisExec.instance || (RedisExec.instance = this)
  }

  public start = async (runnerConfig: IRedisRunnerConfig, runnerKey: string) => {
    RunnerLogger.startContainer(runnerKey)

    const { port, service } = runnerConfig

    let containerId = await getContainerId(service)
    if (!containerId) {
      const portMapping = `--publish ${port}:6379`
      const cmd = `docker-compose run \
                    ${defaultDockerComposeRunOpts} \
                    ${portMapping} \
                    ${service}`
      RunnerLogger.shellCmd(cmd)
      await execa.shell(cmd)
    }
    containerId = await getContainerId(service)

    RunnerLogger.startContainerSuccess(runnerKey)

    return containerId
  }

  public checkHealth = async (
    runnerConfig: IRedisRunnerConfig,
    containerId: string,
    runnerKey: string
  ) => {
    RunnerLogger.checkHealth(runnerKey)

    await this.checkResponsiveness(runnerConfig, containerId, runnerKey)
    await this.checkConnection(runnerConfig, runnerKey)

    RunnerLogger.checkHealthSuccess(runnerKey)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkResponsiveness = async (
    runnerConfig: IRedisRunnerConfig,
    containerId: string,
    runnerKey: string
  ) => {
    const { responsivenessTimeout, host, port } = runnerConfig

    const recurse = async (responsivenessTimeout: number): Promise<void> => {
      RunnerLogger.checkResponsiveness(runnerKey, responsivenessTimeout)

      if (responsivenessTimeout <= 0) {
        throw new DockestError(`Redis responsiveness timed out`)
      }

      try {
        const portMapping = `--publish ${port}:6379`
        const cmd = `docker exec ${containerId} \
                      ${portMapping}`
        // docker run -it --link some-redis:redis --rm redis redis-cli -h redis -p 6379
        // https://hub.docker.com/_/redis
        RunnerLogger.shellCmd(cmd)
        await execa.shell(cmd)

        RunnerLogger.checkResponsivenessSuccess(runnerKey)
      } catch (error) {
        responsivenessTimeout--

        await sleep(1000)
        await recurse(responsivenessTimeout)
      }
    }

    await recurse(responsivenessTimeout)
  }

  private checkConnection = async (
    runnerConfig: IRedisRunnerConfig,
    runnerKey: string
  ): Promise<void> => {
    const { connectionTimeout = 3, host, port } = runnerConfig

    const recurse = async (connectionTimeout: number) => {
      RunnerLogger.checkConnection(runnerKey, connectionTimeout)

      if (connectionTimeout <= 0) {
        throw new DockestError(`Redis connection timed out`)
      }

      try {
        await acquireConnection(port, host)

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

export default RedisExec
