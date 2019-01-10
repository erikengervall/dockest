import { IResources } from '..'
import { IPostgresConfig$Int } from '../DockestConfig'
import DockestError from '../error/DockestError'

let attempts = 3

const postGresRunner = async (
  postgresConfig: IPostgresConfig$Int,
  resources: IResources
): Promise<void> => {
  const { Logger, Execs } = resources
  const {
    postgres: {
      startPostgresContainer,
      checkPostgresResponsiveness,
      postgresMigration,
      postgresSeed,
    },
    helpers: { getContainerId, customCmd },
    teardown: { tearAll },
  } = Execs
  let containerId

  containerId = await getContainerId(postgresConfig)
  postgresConfig.$containerId = containerId

  if (!containerId || containerId.length === 0) {
    await startPostgresContainer(postgresConfig)

    containerId = await getContainerId(postgresConfig)
    postgresConfig.$containerId = containerId
  } else {
    Logger.error('Unexpected container found, releasing resources and re-running')

    await tearAll(containerId)

    if (attempts <= 0) {
      throw new DockestError('Postgres rerun attempts exhausted')
    }

    attempts--
    await postGresRunner(postgresConfig, resources)

    return
  }

  await checkPostgresResponsiveness(containerId, postgresConfig)

  Logger.loading('Running Sequelize scripts')

  const cmds = postgresConfig.cmds
  if (cmds && cmds.length > 0) {
    for (const cmd of cmds) {
      await customCmd(cmd)
    }
  } else {
    await postgresMigration(postgresConfig)
    await postgresSeed(postgresConfig)
  }
}

export default postGresRunner
