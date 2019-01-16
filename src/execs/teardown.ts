import execa from 'execa'

import DockestConfig from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import DockestError from '../error/DockestError'
import PostgresRunner from '../runners/postgres'

const config = new DockestConfig().getConfig()
const logger = new DockestLogger()

const stopContainerById = async (containerId: string, progress: string): Promise<void> => {
  await execa.shell(`docker stop ${containerId}`)

  logger.stop(`Container #${progress} with id <${containerId}> stopped`)
}

const removeContainerById = async (containerId: string, progress: string): Promise<void> => {
  await execa.shell(`docker rm ${containerId} --volumes`)

  logger.stop(`Container #${progress} with id <${containerId}> removed`)
}

const dockerComposeDown = async (): Promise<void> => {
  const timeout = 15
  await execa.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`)

  logger.stop('docker-compose: success')
}

const tearSingle = async (containerId?: string, progress: string = '1'): Promise<void> => {
  if (!containerId) {
    throw new DockestError(`tearSingle: No containerId`)
  }

  logger.loading('Teardown started')

  await stopContainerById(containerId, progress)
  await removeContainerById(containerId, progress)

  await dockerComposeDown() // TODO: Read up on this

  logger.success('Teardown successful')
}

const tearAll = async (): Promise<void> => {
  logger.loading('Teardown started')

  const containerIds: string[] = [
    ...config.runners.reduce(
      (acc: string[], postgresRunner: PostgresRunner) =>
        postgresRunner.containerId ? acc.concat(postgresRunner.containerId) : acc,
      []
    ),
  ]

  const containerIdsLen = containerIds.length
  for (let i = 0; containerIdsLen > i; i++) {
    const progress = `${i + 1}/${containerIdsLen}`
    const containerId = containerIds[i]

    await stopContainerById(containerId, progress)
    await removeContainerById(containerId, progress)
  }

  await dockerComposeDown() // TODO: Read up on this

  logger.success('Teardown successful')
}

export { stopContainerById, removeContainerById, dockerComposeDown, tearSingle, tearAll }
