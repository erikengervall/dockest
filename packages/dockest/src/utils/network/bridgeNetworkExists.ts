import { BRIDGE_NETWORK_NAME } from '../../constants'
import { execaWrapper } from '../execaWrapper'
import { Logger } from '../../Logger'

export const bridgeNetworkExists = async () => {
  const command = `docker network ls \
                    --filter name=${BRIDGE_NETWORK_NAME} \
                    --quiet`

  const networkExists = await execaWrapper(command)
    .then(({ stdout }) => stdout.trim())
    .then(trimmedStdout => !!trimmedStdout)

  if (networkExists) {
    Logger.info(`Found existing network with name ${BRIDGE_NETWORK_NAME}`)
  }

  return networkExists
}
