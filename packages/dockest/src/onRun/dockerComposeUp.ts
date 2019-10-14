import execaWrapper from '../utils/execaWrapper'
import { GENERATED_COMPOSE_FILE_PATH } from '../constants'

const dockerComposeUp = async (serviceNames: string[]) => {
  const command = ` \
              docker-compose \
              -f ${`${GENERATED_COMPOSE_FILE_PATH}`} \
              up \
              --force-recreate \
              --build \
              --detach \
              ${serviceNames.join(' ')} \
            `

  await execaWrapper(command)
}

export default dockerComposeUp
