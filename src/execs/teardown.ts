import execa from 'execa'

import DockestConfig from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import DockestError from '../error/DockestError'
import PostgresRunner from '../runners/postgres'

type stopContainerById = (containerId: string, progress: string) => Promise<void>
type removeContainerById = (containerId: string, progress: string) => Promise<void>
type dockerComposeDown = () => Promise<void>
type tearAll = (containerId?: string) => Promise<void>
type tearSingle = (containerId?: string) => Promise<void>

const config = new DockestConfig().getConfig()
const logger = new DockestLogger()

export const stopContainerById: stopContainerById = async (containerId, progress) => {
  await execa.shell(`docker stop ${containerId}`)

  logger.stop(`Container #${progress} with id <${containerId}> stopped`)
}

export const removeContainerById: removeContainerById = async (containerId, progress) => {
  await execa.shell(`docker rm ${containerId} --volumes`)

  logger.stop(`Container #${progress} with id <${containerId}> removed`)
}

export const dockerComposeDown: dockerComposeDown = async () => {
  const timeout = 15
  await execa.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`)

  logger.stop('docker-compose: success')
}

export const tearSingle: tearSingle = async (containerId, progress = '1') => {
  if (!containerId) {
    throw new DockestError(`tearSingle: No containerId`)
  }

  logger.loading('Teardown started')

  await stopContainerById(containerId, progress)
  await removeContainerById(containerId, progress)

  await dockerComposeDown() // TODO: Read up on this

  logger.success('Teardown successful')
}

export const tearAll: tearAll = async () => {
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
