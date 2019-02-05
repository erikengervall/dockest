import execa from 'execa'

import { defaultDockerComposeRunOpts } from '../../constants'
import { DockestError } from '../../errors'
import { ExecLogger } from '../../loggers'
import { teardownSingle } from '../../utils/teardown'
import { acquireConnection, getContainerId, sleep } from '../utils'

import { IPostgresRunnerConfig } from './index'

interface IExec {
  start: (runnerConfig: IPostgresRunnerConfig, runnerKey: string) => Promise<string>
  checkHealth: (
    runnerConfig: IPostgresRunnerConfig,
    containerId: string,
    runnerKey: string
  ) => Promise<void>
  teardown: (containerId: string, runnerKey: string) => Promise<void>
}

class PostgresExec implements IExec {
  private static instance: PostgresExec

  constructor() {
    return PostgresExec.instance || (PostgresExec.instance = this)
  }

  public start = async (runnerConfig: IPostgresRunnerConfig, runnerKey: string) => {
    ExecLogger.startContainer(runnerKey)

    const { port, service, database, username, password } = runnerConfig

    let containerId = await getContainerId(service)
    if (!containerId) {
      const portMapping = `--publish ${port}:5432`
      const env = `-e POSTGRES_DB=${database} \
                    -e POSTGRES_USER=${username} \
                    -e POSTGRES_PASSWORD=${password}`
      const cmd = `docker-compose run \
                    ${defaultDockerComposeRunOpts} \
                    ${portMapping} \
                    ${env} \
                    ${service}`
      ExecLogger.shellCmd(cmd)
      await execa.shell(cmd)
    }
    containerId = await getContainerId(service)

    ExecLogger.startContainerSuccess(runnerKey)

    return containerId
  }

  public checkHealth = async (
    runnerConfig: IPostgresRunnerConfig,
    containerId: string,
    runnerKey: string
  ) => {
    ExecLogger.checkHealth(runnerKey)

    await this.checkResponsiveness(runnerConfig, containerId, runnerKey)
    await this.checkConnection(runnerConfig, runnerKey)

    ExecLogger.checkHealthSuccess(runnerKey)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkResponsiveness = async (
    runnerConfig: IPostgresRunnerConfig,
    containerId: string,
    runnerKey: string
  ) => {
    const { responsivenessTimeout = 10, host, database, username } = runnerConfig

    const recurse = async (responsivenessTimeout: number): Promise<void> => {
      ExecLogger.checkResponsiveness(runnerKey, responsivenessTimeout)

      if (responsivenessTimeout <= 0) {
        throw new DockestError(`Database responsiveness timed out`)
      }

      try {
        const cmd = `docker exec ${containerId} \
                      bash -c "psql \
                      -h ${host} \
                      -d ${database} \
                      -U ${username} \
                      -c 'select 1'"`
        ExecLogger.shellCmd(cmd)
        await execa.shell(cmd)

        ExecLogger.checkResponsivenessSuccess(runnerKey)
      } catch (error) {
        responsivenessTimeout--

        await sleep(1000)
        await recurse(responsivenessTimeout)
      }
    }

    await recurse(responsivenessTimeout)
  }

  private checkConnection = async (
    runnerConfig: IPostgresRunnerConfig,
    runnerKey: string
  ): Promise<void> => {
    const { connectionTimeout = 3, host, port } = runnerConfig

    const recurse = async (connectionTimeout: number) => {
      ExecLogger.checkConnection(runnerKey, connectionTimeout)

      if (connectionTimeout <= 0) {
        throw new DockestError(`Database connection timed out`)
      }

      try {
        await acquireConnection(port, host)

        ExecLogger.checkConnectionSuccess(runnerKey)
      } catch (error) {
        connectionTimeout--

        await sleep(1000)
        await recurse(connectionTimeout)
      }
    }

    await recurse(connectionTimeout)
  }
}

export default PostgresExec
