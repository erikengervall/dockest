import execaWrapper from '../utils/execaWrapper'
import { GENERATED_COMPOSE_FILE_PATH } from '../constants'

const dockerComposeUp = async () => {
  const command = ` \
              docker-compose \
              -f ${`${GENERATED_COMPOSE_FILE_PATH}`} \
              up \
              --force-recreate \
              --build \
              --detach \
            `

  await execaWrapper(command)
}

export default dockerComposeUp
