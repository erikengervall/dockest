import execa from 'execa'
import { defaultDockerComposeRunOpts } from '../../constants'
import { DockestError } from '../../errors'
import { RunnerLogger } from '../../loggers'
import { acquireConnection, getContainerId, sleep, teardownSingle } from '../utils'
import { RedisRunnerConfig } from './index'

interface Exec {
  start: (runnerConfig: RedisRunnerConfig, runnerKey: string) => Promise<string>
  checkHealth: (
    runnerConfig: RedisRunnerConfig,
    containerId: string,
    runnerKey: string
  ) => Promise<void>
  teardown: (containerId: string, runnerKey: string) => Promise<void>
}

class RedisExec implements Exec {
  private static instance: RedisExec

  constructor() {
    return RedisExec.instance || (RedisExec.instance = this)
  }

  public start = async (runnerConfig: RedisRunnerConfig, runnerKey: string) => {
    RunnerLogger.startContainer(runnerKey)

    const { port, service, password } = runnerConfig

    let containerId = await getContainerId(service)
    if (!containerId) {
      const portMapping = `--publish ${port}:6379`
      const auth = !!password ? `--requirepass ${password}` : ''
      const cmd = `docker-compose run \
                    ${defaultDockerComposeRunOpts} \
                    ${portMapping} \
                    ${service} \
                    ${auth}`
      RunnerLogger.shellCmd(cmd)
      await execa.shell(cmd)
    }
    containerId = await getContainerId(service)

    RunnerLogger.startContainerSuccess(runnerKey)

    return containerId
  }

  public checkHealth = async (
    runnerConfig: RedisRunnerConfig,
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
    runnerConfig: RedisRunnerConfig,
    containerId: string,
    runnerKey: string
  ) => {
    const { responsivenessTimeout, host: runnerHost, password: runnerPassword } = runnerConfig

    const recurse = async (responsivenessTimeout: number): Promise<void> => {
      RunnerLogger.checkResponsiveness(runnerKey, responsivenessTimeout)

      if (responsivenessTimeout <= 0) {
        throw new DockestError(`Redis responsiveness timed out`)
      }

      try {
        const host = `-h ${runnerHost}`
        const port = `-p 6379`
        const password = runnerPassword ? `-a ${runnerPassword}` : ''
        const command = `PING`
        const redisCliOpts = `${host} \
                              ${port} \
                              ${password} \
                              ${command}`
        const cmd = `docker exec ${containerId} redis-cli ${redisCliOpts}`
        RunnerLogger.shellCmd(cmd)
        const { stdout: result } = await execa.shell(cmd)
        if (result !== 'PONG') {
          throw new Error('PING did not recieve a PONG')
        }

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
    runnerConfig: RedisRunnerConfig,
    runnerKey: string
  ): Promise<void> => {
    const { connectionTimeout, host, port } = runnerConfig

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
