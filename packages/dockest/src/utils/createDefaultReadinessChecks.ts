import { execaWrapper } from './execaWrapper'
import { DefaultReadinessChecks, Runner } from '../@types'

export const createDefaultReadinessChecks = ({
  runner,
  runner: {
    containerId,
    dockerComposeFileService: { ports },
  },
}: {
  runner: Runner
}): DefaultReadinessChecks => ({
  postgres: async ({ POSTGRES_DB, POSTGRES_USER }: { POSTGRES_DB: string; POSTGRES_USER: string }) => {
    // Ref: http://postgresguide.com/utilities/psql.html
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

  web: async (port = 3000) => {
    const command = `docker exec ${containerId} \
                        sh -c "wget --quiet --tries=1 --spider http://localhost:${port}/.well-known/healthcheck"`

    await execaWrapper(command, { runner })
  },
})
