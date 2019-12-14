import { BRIDGE_NETWORK_NAME } from '../../constants'
import { execaWrapper } from '../execaWrapper'

export const joinBridgeNetwork = async (containerId: string, alias: string) => {
  const command = `docker network connect \
                    ${BRIDGE_NETWORK_NAME} \
                    ${`--alias ${alias}`} \
                    ${containerId}`

  await execaWrapper(command)
}
