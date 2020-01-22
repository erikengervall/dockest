import { execaWrapper } from '../../utils/execaWrapper'
import { GENERATED_COMPOSE_FILE_PATH } from '../../constants'
import { Runner } from '../../@types'

export const dockerComposeUp = async (runners: Runner[]) => {
  const servicesToStart = runners.map(({ serviceName }) => serviceName).join(' ')

  const command = `docker-compose \
                    -f ${`${GENERATED_COMPOSE_FILE_PATH}`} \
                    up \
                    --force-recreate \
                    --build \
                    --detach \
                    ${servicesToStart}`

  await execaWrapper(command)
}
