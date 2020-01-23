import { execaWrapper } from './execaWrapper'
import { DefaultHealthchecks, Runner } from '../@types'
import { ConfigurationError } from '../Errors'

export const createDefaultHealthchecks = (runner: Runner): DefaultHealthchecks => ({
  postgres: async ({ environment }) => {
    if (!environment) {
      throw new ConfigurationError(`Postgres healthcheck: Missing environment`)
    }

    const { POSTGRES_DB, POSTGRES_USER } = environment
    if (!POSTGRES_DB) {
      throw new ConfigurationError(`Postgres healthcheck: Missing POSTGRES_DB`)
    }
    if (!POSTGRES_USER) {
      throw new ConfigurationError(`Postgres healthcheck: Missing POSTGRES_USER`)
    }

    const command = `docker exec ${runner.containerId} bash -c " \
                        psql \
                        -h localhost \
                        -d ${POSTGRES_DB} \
                        -U ${POSTGRES_USER} \
                        -c 'select 1'"`

    await execaWrapper(command, { runner })
  },

  redis: async ({ ports }) => {
    const command = `docker exec ${runner.containerId} redis-cli \
                      -h localhost \
                      -p ${ports[0].target} \
                      PING`

    await execaWrapper(command, { runner })
  },

  web: async () => {
    const command = `docker exec ${runner.containerId} \
                      sh -c "wget --quiet --tries=1 --spider http://localhost:3000/.well-known/healthcheck"`

    await execaWrapper(command, { runner })
  },
})
