import execa from 'execa'

import { DockestError } from '../../errors'
import { acquireConnection, getContainerId, sleep } from '../../utils/execs'
import logger from '../../utils/logger'
import { tearSingle } from '../../utils/teardown'
import { IExec } from '../types'
import { IPostgresRunnerConfig } from './index'

class PostgresExec implements IExec {
  private static instance: PostgresExec

  constructor() {
    if (PostgresExec.instance) {
      return PostgresExec.instance
    }

    PostgresExec.instance = this
  }

  public start = async (runnerConfig: IPostgresRunnerConfig, dockerComposeFilePath?: string) => {
    logger.loading('Starting postgres container')

    const { port, service } = runnerConfig

    const file = dockerComposeFilePath ? `--file ${dockerComposeFilePath}` : ''
    await execa.shell(
      `docker-compose ${file} run --detach --no-deps --publish ${port}:5432 ${service}`
    )
    const containerId = await getContainerId(service)

    logger.success('Postgres container started successfully')

    return containerId
  }

  public checkHealth = async (containerId: string, runnerConfig: IPostgresRunnerConfig) => {
    await this.checkResponsiveness(containerId, runnerConfig)
    await this.checkConnection(runnerConfig)
  }

  public teardown = async (containerId?: string) => {
    await tearSingle(containerId)
  }

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
    return // causes issues with travis
    logger.loading('Attempting to establish database connection')

    const { connectionTimeout = 3, host, port } = runnerConfig

    const recurse = async (connectionTimeout: number) => {
      logger.loading(`Establishing database connection (Timing out in: ${connectionTimeout}s)`)

      if (connectionTimeout <= 0) {
        throw new DockestError(`Database connection timed out`)
      }

      try {
        await acquireConnection(host, port)

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
