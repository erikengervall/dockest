import execa from 'execa'

import { defaultDockerComposeRunOpts } from '../../constants'
import { DockestError } from '../../errors'
import { acquireConnection, getContainerId, sleep } from '../../utils/execs'
import logger from '../../utils/logger'
import { teardownSingle } from '../../utils/teardown'

import { IPostgresRunnerConfig } from './index'

interface IExec {
  start: (runnerConfig: IPostgresRunnerConfig) => Promise<string>
  checkHealth: (runnerConfig: IPostgresRunnerConfig, containerId: string) => Promise<void>
  teardown: (containerId: string, runnerKey: string) => Promise<void>
}

class PostgresExec implements IExec {
  private static instance: PostgresExec

  constructor() {
    if (PostgresExec.instance) {
      return PostgresExec.instance
    }

    PostgresExec.instance = this
  }

  public start = async (runnerConfig: IPostgresRunnerConfig) => {
    logger.loading('Starting postgres container')

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
      logger.command(cmd)
      await execa.shell(cmd)
    }
    containerId = await getContainerId(service)

    logger.success(`Postgres container started successfully`)

    return containerId
  }

  public checkHealth = async (runnerConfig: IPostgresRunnerConfig, containerId: string) => {
    await this.checkResponsiveness(runnerConfig, containerId)
    await this.checkConnection(runnerConfig)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkResponsiveness = async (
    runnerConfig: IPostgresRunnerConfig,
    containerId: string
  ) => {
    logger.loading('Attempting to establish database responsiveness')

    const { responsivenessTimeout = 10, host, database, username } = runnerConfig

    const recurse = async (responsivenessTimeout: number): Promise<void> => {
      logger.loading(
        `Establishing database responsiveness (Timing out in: ${responsivenessTimeout}s)`
      )

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
        logger.command(cmd)
        await execa.shell(cmd)

        logger.success('Database responsiveness established')
      } catch (error) {
        responsivenessTimeout--

        await sleep(1000)
        await recurse(responsivenessTimeout)
      }
    }

    await recurse(responsivenessTimeout)
  }

  private checkConnection = async (runnerConfig: IPostgresRunnerConfig): Promise<void> => {
    logger.loading('Attempting to establish database connection')

    const { connectionTimeout = 3, host, port } = runnerConfig

    const recurse = async (connectionTimeout: number) => {
      logger.loading(`Establishing database connection (Timing out in: ${connectionTimeout}s)`)

      if (connectionTimeout <= 0) {
        throw new DockestError(`Database connection timed out`)
      }

      try {
        await acquireConnection(port, host)

        logger.success('Database connection established')
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
