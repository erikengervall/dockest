import { execaWrapper } from '../../utils/execaWrapper'
import { GENERATED_COMPOSE_FILE_PATH } from '../../constants'

export const dockerComposeUp = async (servicesToStart: string) => {
  const command = `docker-compose \
                    -f ${`${GENERATED_COMPOSE_FILE_PATH}`} \
                    up \
                    --force-recreate \
                    --build \
                    --detach \
                    ${servicesToStart}`

  await execaWrapper(command)
}
