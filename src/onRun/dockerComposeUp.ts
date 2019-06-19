import { execa } from '../utils'

const dockerComposeUp = (DOCKER_COMPOSE_GENERATED_PATH: string) => {
  execa(` \
          docker-compose \
          -f ${DOCKER_COMPOSE_GENERATED_PATH} \
          up \
          --no-recreate \
          --detach \
        `)
}

export default dockerComposeUp
