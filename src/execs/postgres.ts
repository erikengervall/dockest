import execa from 'execa'

import DockestConfig from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import DockestError from '../error/DockestError'
import { IPostgresRunnerConfig } from '../runners/postgres'
import { acquireConnection, sleep } from './utils'

const config = new DockestConfig().getConfig()
const logger = new DockestLogger()

const startContainer = async (runnerConfig: IPostgresRunnerConfig): Promise<string> => {
  logger.loading('Starting postgres container')

  const { label, port, service } = runnerConfig

  const dockerComposeFilePath = config.dockest.dockerComposeFilePath
    ? `--file ${config.dockest.dockerComposeFilePath}`
    : ''
  const { stdout: containerId } = await execa.shell(
    `docker-compose ${dockerComposeFilePath} run --detach --no-deps --label ${label} --publish ${port}:5432 ${service}`
  )

  logger.success('Postgres container started successfully')

  return containerId
}

const checkConnection = async (runnerConfig: IPostgresRunnerConfig): Promise<void> => {
  logger.loading('Attempting to establish database connection')

  const { connectionTimeout = 3, host, port } = runnerConfig

  const recurse = async (connectionTimeout: number) => {
    logger.info(`Establishing database connection (Timing out in: ${connectionTimeout}s)`)

    if (connectionTimeout <= 0) {
      throw new DockestError('Database connection timed out')
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

const checkResponsiveness = async (
  containerId: string,
  runnerConfig: IPostgresRunnerConfig
): Promise<void> => {
  logger.loading('Attempting to establish database responsiveness')

  const { responsivenessTimeout = 10, host, username, db } = runnerConfig

  type Recurse = (responsivenessTimeout: number) => Promise<void>
  const recurse: Recurse = async responsivenessTimeout => {
    logger.info(`Establishing database responsiveness (Timing out in: ${responsivenessTimeout}s)`)

    if (responsivenessTimeout <= 0) {
      throw new DockestError('Database responsiveness timed out')
    }

    try {
      await execa.shell(
        `docker exec ${containerId} bash -c "psql -h ${host} -U ${username} -d ${db} -c 'select 1'"`
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

export { startContainer, checkConnection, checkResponsiveness }
