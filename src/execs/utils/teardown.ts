import execa from 'execa'

import Logger from '../../DockestLogger'
import DockestError from '../../errors/DockestError'
import Dockest from '../../index'
import PostgresRunner from '../../runners/postgres'

const logger = new Logger()

class Teardown {
  private static instance: Teardown

  constructor() {
    if (Teardown.instance) {
      return Teardown.instance
    }
  }

  public tearSingle = async (containerId?: string, progress: string = '1'): Promise<void> => {
    if (!containerId) {
      throw new DockestError(`${this.tearSingle.name}: No containerId`)
    }

    logger.loading('Teardown started')

    await this.stopContainerById(containerId, progress)
    await this.removeContainerById(containerId, progress)

    await this.dockerComposeDown() // TODO: Read up on this

    logger.success('Teardown successful')
  }

  public tearAll = async (): Promise<void> => {
    logger.loading('Teardown started')

    const config = Dockest.config

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

      await this.stopContainerById(containerId, progress)
      await this.removeContainerById(containerId, progress)
    }

    await this.dockerComposeDown() // TODO: Read up on this

    logger.success('Teardown successful')
  }

  private stopContainerById = async (containerId: string, progress: string): Promise<void> => {
    await execa.shell(`docker stop ${containerId}`)

    logger.stop(`Container #${progress} with id <${containerId}> stopped`)
  }

  private removeContainerById = async (containerId: string, progress: string): Promise<void> => {
    await execa.shell(`docker rm ${containerId} --volumes`)

    logger.stop(`Container #${progress} with id <${containerId}> removed`)
  }

  private dockerComposeDown = async (): Promise<void> => {
    const timeout = 15
    await execa.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`)

    logger.stop('docker-compose: success')
  }
}

export default Teardown
