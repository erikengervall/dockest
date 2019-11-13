import execa from 'execa' /* eslint-disable-line import/default */
import { GENERATED_COMPOSE_FILE_PATH } from '../constants'

const dockerComposeUp = (serviceNames: string[]) => {
  const command = ` \
              docker-compose \
              -f ${`${GENERATED_COMPOSE_FILE_PATH}`} \
              up \
              --force-recreate \
              --no-build \
              ${serviceNames.join(' ')} \
            `

  return execa(command, { shell: true })
}

export default dockerComposeUp
