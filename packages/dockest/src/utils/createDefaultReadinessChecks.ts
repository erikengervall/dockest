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
  postgres: async ({ database, username }: { database: string; username: string }) => {
    // Ref: http://postgresguide.com/utilities/psql.html
    const command = `docker exec ${containerId} bash -c " \
                        psql \
                        -h localhost \
                        -d ${database} \
                        -U ${username} \
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
})
