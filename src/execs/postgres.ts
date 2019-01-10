import execa from 'execa'

import DockestConfig, { IPostgresConfig$Int } from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import DockestError from '../error/DockestError'
import { sleep } from './utils'

type startPostgresContainer = (postgresConfig: IPostgresConfig$Int) => Promise<void>
type checkPostgresConnection = (postgresConfig: IPostgresConfig$Int) => Promise<void>
type checkPostgresResponsiveness = (
  containerId: string,
  postgresConfig: IPostgresConfig$Int
) => Promise<void>

export interface IPostgres {
  startPostgresContainer: startPostgresContainer;
  checkPostgresConnection: checkPostgresConnection;
  checkPostgresResponsiveness: checkPostgresResponsiveness;
}

const createPostgres = (Config: DockestConfig, Logger: DockestLogger): IPostgres => {
  const config = Config.getConfig()

  const startPostgresContainer: startPostgresContainer = async postgresConfig => {
    Logger.loading('Starting postgres container')

    const dockerComposeFilePath = config.dockest.dockerComposeFilePath
      ? `--file ${config.dockest.dockerComposeFilePath}`
      : ''
    await execa.shell(
      `docker-compose ${dockerComposeFilePath} run --detach --no-deps --label ${
        postgresConfig.label
      } --publish ${postgresConfig.port}:5432 ${postgresConfig.service}`
    )

    Logger.success('Postgres container started successfully')
  }

  // Deprecated
  const checkPostgresConnection: checkPostgresConnection = async postgresConfig => {
    Logger.loading('Attempting to establish database connection')

    const { connectionTimeout: timeout = 3, host, port } = postgresConfig

    const recurse = async (timeout: number) => {
      Logger.info(`Establishing database connection (Timing out in: ${timeout}s)`)

      if (timeout <= 0) {
        throw new DockestError('Database connection timed out')
      }

      try {
        await execa.shell(`echo > /dev/tcp/${host}/${port}`)

        Logger.success('Database connection established')
      } catch (error) {
        timeout--

        await sleep(1000)
        await recurse(timeout)
      }
    }

    await recurse(timeout)
  }

  const checkPostgresResponsiveness: checkPostgresResponsiveness = async (
    containerId,
    postgresConfig
  ) => {
    Logger.loading('Attempting to establish database responsiveness')

    const { responsivenessTimeout: timeout = 10, host, username, db } = postgresConfig

    type Recurse = (timeout: number) => Promise<void>
    const recurse: Recurse = async timeout => {
      Logger.info(`Establishing database responsiveness (Timing out in: ${timeout}s)`)

      if (timeout <= 0) {
        throw new DockestError('Database responsiveness timed out')
      }

      try {
        await execa.shell(
          `docker exec ${containerId} bash -c "psql -h ${host} -U ${username} -d ${db} -c 'select 1'"`
        )

        Logger.success('Database responsiveness established')
      } catch (error) {
        timeout--

        await sleep(1000)
        await recurse(timeout)
      }
    }

    await recurse(timeout)
  }

  return {
    startPostgresContainer,
    checkPostgresConnection,
    checkPostgresResponsiveness,
  }
}

export default createPostgres
