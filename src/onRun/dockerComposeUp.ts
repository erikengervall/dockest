import { Runner } from '../runners'
import { execaWrapper } from '../utils'

const dockerComposeUp = (DOCKER_COMPOSE_GENERATED_PATH: string, runner?: Runner) => {
  const cmd = ` \
              docker-compose \
              -f ${DOCKER_COMPOSE_GENERATED_PATH} \
              up \
              --no-recreate \
              --detach \
            `

  execaWrapper(cmd, runner)
}

export default dockerComposeUp
