import execa from 'execa'

import DockestConfig from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import DockestError from '../error/DockestError'
import { IPostgresRunnerConfig } from '../runners/postgres'
import { sleep } from './utils'

type startPostgresContainer = (postgresConfig: IPostgresRunnerConfig) => Promise<string>
type checkPostgresConnection = (postgresConfig: IPostgresRunnerConfig) => Promise<void>
type checkPostgresResponsiveness = (
  containerId: string,
  postgresConfig: IPostgresRunnerConfig
) => Promise<void>

export interface IPostgres {
  startPostgresContainer: startPostgresContainer
  checkPostgresConnection: checkPostgresConnection
  checkPostgresResponsiveness: checkPostgresResponsiveness
}

const config = new DockestConfig().getConfig()
const logger = new DockestLogger()

export const startPostgresContainer: startPostgresContainer = async ({ label, port, service }) => {
  logger.loading('Starting postgres container')

  const dockerComposeFilePath = config.dockest.dockerComposeFilePath
    ? `--file ${config.dockest.dockerComposeFilePath}`
    : ''
  const { stdout: containerId } = await execa.shell(
    `docker-compose ${dockerComposeFilePath} run --detach --no-deps --label ${label} --publish ${port}:5432 ${service}`
  )

  logger.success('Postgres container started successfully')

  return containerId
}

// Deprecated
const checkPostgresConnection: checkPostgresConnection = async ({
  connectionTimeout: timeout = 3,
  host,
  port,
}) => {
  logger.loading('Attempting to establish database connection')

  const recurse = async (timeout: number) => {
    logger.info(`Establishing database connection (Timing out in: ${timeout}s)`)

    if (timeout <= 0) {
      throw new DockestError('Database connection timed out')
    }

    try {
      await execa.shell(`echo > /dev/tcp/${host}/${port}`)

      logger.success('Database connection established')
    } catch (error) {
      timeout--

      await sleep(1000)
      await recurse(timeout)
    }
  }

  await recurse(timeout)
}

export const checkPostgresResponsiveness: checkPostgresResponsiveness = async (
  containerId,
  { responsivenessTimeout: timeout = 10, host, username, db }
) => {
  logger.loading('Attempting to establish database responsiveness')

  type Recurse = (timeout: number) => Promise<void>
  const recurse: Recurse = async timeout => {
    logger.info(`Establishing database responsiveness (Timing out in: ${timeout}s)`)

    if (timeout <= 0) {
      throw new DockestError('Database responsiveness timed out')
    }

    try {
      await execa.shell(
        `docker exec ${containerId} bash -c "psql -h ${host} -U ${username} -d ${db} -c 'select 1'"`
      )

      logger.success('Database responsiveness established')
    } catch (error) {
      timeout--

      await sleep(1000)
      await recurse(timeout)
    }
  }

  await recurse(timeout)
}
