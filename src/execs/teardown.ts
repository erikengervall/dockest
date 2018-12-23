import execa from 'execa'

import DockestConfig, {
  IKafkaConfig$Int,
  IPostgresConfig$Int,
  IRedisConfig$Int,
} from '../DockestConfig'
import DockestLogger from '../DockestLogger'

type stopContainerById = (containerId: string) => Promise<void>
type removeContainerById = (containerId: string) => Promise<void>
type dockerComposeDown = () => Promise<void>
type tearAll = (containerId?: string) => Promise<void>

export interface ITeardown {
  stopContainerById: stopContainerById;
  removeContainerById: removeContainerById;
  dockerComposeDown: dockerComposeDown;
  tearAll: tearAll;
}

const createTeardown = (Config: DockestConfig, Logger: DockestLogger): ITeardown => {
  const stopContainerById: stopContainerById = async containerId => {
    await execa.shell(`docker stop ${containerId}`)

    Logger.stop(`Container with id <${containerId}> stopped`)
  }

  const removeContainerById: removeContainerById = async containerId => {
    await execa.shell(`docker rm ${containerId} --volumes`)

    Logger.stop(`Container with id <${containerId}> removed`)
  }

  const dockerComposeDown: dockerComposeDown = async () => {
    const timeout = 10
    await execa.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`)

    Logger.stop('docker-compose down ran successfully')
  }

  const tearAll: tearAll = async () => {
    Logger.loading('Teardown started')

    const containerIds: string[] = [
      ...Config.getConfig().kafka.map((k: IKafkaConfig$Int) => k.$.containerId),
      ...Config.getConfig().redis.map((r: IRedisConfig$Int) => r.$.containerId),
      ...Config.getConfig().postgres.map((p: IPostgresConfig$Int) => p.$.containerId),
    ]

    for (let i = 0; containerIds.length > 0; i++) {
      const containerId = containerIds[i]

      if (containerId) {
        await stopContainerById(containerId)
        await removeContainerById(containerId)
        // await dockerComposeDown() // Causes issues with exit
      }
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
