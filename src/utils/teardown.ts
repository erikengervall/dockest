import execa from 'execa'

import { DockestError } from '../errors'
import Dockest from '../index'
import PostgresRunner from '../runners/postgres'
import logger from './logger'

const { values } = Object

const tearSingle = async (containerId?: string, progress: string = '1/1 '): Promise<void> => {
  if (!containerId) {
    throw new DockestError(`No containerId`)
  }

  await stopContainerById(containerId, progress)
  await removeContainerById(containerId, progress)
}

const tearAll = async (): Promise<void> => {
  logger.loading('Teardown started')

  const config = Dockest.config

  const containerIds = [
    ...values(config.runners).reduce(
      (acc: string[], postgresRunner: PostgresRunner) =>
        postgresRunner.containerId ? acc.concat(postgresRunner.containerId) : acc,
      []
    ),
  ]

  for (let i = 0; containerIds.length > i; i++) {
    const progress = `${i + 1}/${containerIds.length} `
    const containerId = containerIds[i]

    await tearSingle(containerId, progress)
  }

  logger.success('Teardown successful')
}

const stopContainerById = async (containerId: string, progress: string): Promise<void> => {
  await execa.shell(`docker stop ${containerId}`)

  logger.loading(`Container #${progress}with id <${containerId}> stopped`)
}

const removeContainerById = async (containerId: string, progress: string): Promise<void> => {
  await execa.shell(`docker rm ${containerId} --volumes`)

  logger.loading(`Container #${progress} with id <${containerId}> removed`)
}

const dockerComposeDown = async (): Promise<void> => {
  const timeout = 15
  await execa.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`)

  logger.stop(`Ran "docker-compose down"`)
}

export { tearSingle, tearAll, dockerComposeDown }
