import execa from 'execa'

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

    const { port, service } = runnerConfig
    let containerId = ''

    containerId = await getContainerId(service)
    if (!containerId) {
      await execa.shell(`docker-compose run --detach --no-deps --publish ${port}:5432 ${service}`)
    }

    containerId = await getContainerId(service)

    logger.success(`Postgres container started successfully`)

    return containerId
  }

  public checkHealth = async (runnerConfig: IPostgresRunnerConfig, containerId: string) => {
    await this.checkResponsiveness(containerId, runnerConfig)
    await this.checkConnection(runnerConfig)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkResponsiveness = async (
    containerId: string,
    runnerConfig: IPostgresRunnerConfig
  ) => {
    logger.loading('Attempting to establish database responsiveness')

    const { responsivenessTimeout = 10, host, username, database } = runnerConfig

    type Recurse = (responsivenessTimeout: number) => Promise<void>
    const recurse: Recurse = async responsivenessTimeout => {
      logger.loading(
        `Establishing database responsiveness (Timing out in: ${responsivenessTimeout}s)`
      )

      if (responsivenessTimeout <= 0) {
        throw new DockestError(`Database responsiveness timed out`)
      }

      try {
        await execa.shell(
          `docker exec ${containerId} bash -c "psql -h ${host} -U ${username} -d ${database} -c 'select 1'"`
        )

        logger.success('Database responsiveness established')
      } catch (error) {
        responsivenessTimeout--

        await sleep(1000)
        await recurse(responsivenessTimeout)
      }
    }

    await recurse(responsivenessTimeout)
  }

  private checkConnection = async (runnerConfig: IPostgresRunnerConfig) => {
    // return // causes issues with travis
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
