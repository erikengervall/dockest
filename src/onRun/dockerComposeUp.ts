import { Runner } from '../runners/@types'
import { execaWrapper } from '../utils'

const dockerComposeUp = (dockerComposeGeneratedPath: string, runner?: Runner) => {
  const cmd = ` \
              docker-compose \
              -f ${dockerComposeGeneratedPath} \
              up \
              --no-recreate \
              --detach \
            `

  execaWrapper(cmd, runner)
}

export default dockerComposeUp
