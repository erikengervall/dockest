import { Healthcheck } from '../@types'

export const defaultHealthchecks: {
  postgres: Healthcheck
  redis: Healthcheck
  web: Healthcheck
} = {
  postgres: ({ environment: { POSTGRES_DB, POSTGRES_USER } }, containerId) =>
    `docker exec ${containerId} bash -c "\
        psql \
        -h localhost \
        -d ${POSTGRES_DB} \
        -U ${POSTGRES_USER} \
        -c 'select 1'"`,

  redis: ({ ports }, containerId) => `docker exec ${containerId} redis-cli \
                                        -h localhost \
                                        -p ${ports[0].target} \
                                        PING`,

  web: (_, containerId) => `docker exec ${containerId} \
                              sh -c "wget --quiet --tries=1 --spider http://localhost:3000/.well-known/healthcheck"`,
}
