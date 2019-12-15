import { Healthcheck, DockerComposeFileServicePostgres } from '../@types'
import { ConfigurationError } from '../Errors'

export const defaultHealthchecks: {
  postgres: Healthcheck<DockerComposeFileServicePostgres>
  redis: Healthcheck
  web: Healthcheck
} = {
  postgres: ({ environment }, containerId) => {
    if (!environment) {
      throw new ConfigurationError('Missing environment for postgres healthcheck')
    }

    const { POSTGRES_DB, POSTGRES_USER } = environment
    if (!POSTGRES_DB || !POSTGRES_USER) {
      throw new ConfigurationError('Missing POSTGRES_DB or POSTGRES_USER for postgres healthcheck')
    }

    return `docker exec ${containerId} bash -c " \
              psql \
              -h localhost \
              -d ${POSTGRES_DB} \
              -U ${POSTGRES_USER} \
              -c 'select 1'"`
  },

  redis: ({ ports }, containerId) => `docker exec ${containerId} redis-cli \
                                        -h localhost \
                                        -p ${ports[0].target} \
                                        PING`,

  web: (_, containerId) => `docker exec ${containerId} \
                              sh -c "wget --quiet --tries=1 --spider http://localhost:3000/.well-known/healthcheck"`,
}
