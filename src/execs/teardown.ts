import execa from 'execa'

import DockestConfig, {
  IKafkaConfig$Int,
  IPostgresConfig$Int,
  IRedisConfig$Int,
} from '../DockestConfig'
import DockestLogger from '../DockestLogger'

type stopContainerById = (containerId: string, progress: string) => Promise<void>
type removeContainerById = (containerId: string, progress: string) => Promise<void>
type dockerComposeDown = () => Promise<void>
type tearAll = (containerId?: string) => Promise<void>

export interface ITeardown {
  stopContainerById: stopContainerById;
  removeContainerById: removeContainerById;
  dockerComposeDown: dockerComposeDown;
  tearAll: tearAll;
}

const createTeardown = (Config: DockestConfig, Logger: DockestLogger): ITeardown => {
  const stopContainerById: stopContainerById = async (containerId, progress) => {
    await execa.shell(`docker stop ${containerId}`)

    Logger.stop(`Container #${progress} with id <${containerId}> stopped`)
  }

  const removeContainerById: removeContainerById = async (containerId, progress) => {
    await execa.shell(`docker rm ${containerId} --volumes`)

    Logger.stop(`Container #${progress} with id <${containerId}> removed`)
  }

  const dockerComposeDown: dockerComposeDown = async () => {
    const timeout = 10
    await execa.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`)

    Logger.stop('docker-compose down ran successfully')
  }

  const tearAll: tearAll = async () => {
    Logger.loading('Teardown started')

    const containerIds: string[] = [
      ...Config.getConfig().kafka.reduce(
        (acc: string[], k: IKafkaConfig$Int) => (k.$containerId ? acc.concat(k.$containerId) : acc),
        []
      ),
      ...Config.getConfig().redis.reduce(
        (acc: string[], r: IRedisConfig$Int) => (r.$containerId ? acc.concat(r.$containerId) : acc),
        []
      ),
      ...Config.getConfig().postgres.reduce(
        (acc: string[], p: IPostgresConfig$Int) =>
          p.$containerId ? acc.concat(p.$containerId) : acc,
        []
      ),
    ]

    const containerIdsLen = containerIds.length
    for (let i = 0; containerIdsLen > i; i++) {
      const progress = `${i}/${containerIdsLen}`
      const containerId = containerIds[i]

      await stopContainerById(containerId, progress)
      await removeContainerById(containerId, progress)
      // await dockerComposeDown(progress) // TODO: Read up on this
    }

    Logger.success('Teardown successful')
  }

  return {
    stopContainerById,
    removeContainerById,
    dockerComposeDown,
    tearAll,
  }
}

export default createTeardown
