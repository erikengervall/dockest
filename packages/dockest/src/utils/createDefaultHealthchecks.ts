import { execaWrapper } from './execaWrapper'
import { DefaultHealthchecks, Runner, DockerComposeFileServicePostgres } from '../@types'
import { ConfigurationError } from '../Errors'

export const createDefaultHealthchecks = (runner: Runner): DefaultHealthchecks => {
  const {
    dockerComposeFileService: { ports },
    containerId,
  } = runner

  return {
    postgres: async () => {
      const { environment } = runner.dockerComposeFileService as DockerComposeFileServicePostgres

      if (!environment) {
        throw new ConfigurationError(`Postgres healthcheck: Missing environment in Compose file`)
      }

      const { POSTGRES_DB } = environment
      if (!POSTGRES_DB) {
        throw new ConfigurationError(`Postgres healthcheck: Missing POSTGRES_DB in Compose file`)
      }

      const { POSTGRES_USER } = environment
      if (!POSTGRES_USER) {
        throw new ConfigurationError(`Postgres healthcheck: Missing POSTGRES_USER in Compose file`)
      }

      const command = `docker exec ${containerId} bash -c " \
                        psql \
                        -h localhost \
                        -d ${POSTGRES_DB} \
                        -U ${POSTGRES_USER} \
                        -c 'select 1'"`

      await execaWrapper(command, { runner })
    },

    redis: async () => {
      const command = `docker exec ${containerId} redis-cli \
                        -h localhost \
                        -p ${ports[0].target} \
                        PING`

      await execaWrapper(command, { runner })
    },

    web: async () => {
      const command = `docker exec ${containerId} \
                        sh -c "wget --quiet --tries=1 --spider http://localhost:3000/.well-known/healthcheck"`

      await execaWrapper(command, { runner })
    },
  }
}
