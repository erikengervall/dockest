import { Runner } from '../runners/@types'
import execaWrapper from '../utils/execaWrapper'

const dockerComposeUp = (dockerComposeGeneratedPath: string, runner?: Runner) => {
  const command = ` \
              docker-compose \
              -f ${dockerComposeGeneratedPath} \
              up \
              --no-recreate \
              --detach \
            `

  execaWrapper(command, runner)
}

export default dockerComposeUp
