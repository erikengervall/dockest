import { Runner } from '../runners/@types'
import execaWrapper from '../utils/execaWrapper'

const dockerComposeUp = async (dockerComposeGeneratedPath: string, runner?: Runner) => {
  const command = ` \
              docker-compose \
              -f ${dockerComposeGeneratedPath} \
              up \
              --no-recreate \
              --build \
              --detach \
            `

  await execaWrapper(command, runner)
}

export default dockerComposeUp
