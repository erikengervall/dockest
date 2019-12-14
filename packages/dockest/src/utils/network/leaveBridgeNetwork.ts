import { BRIDGE_NETWORK_NAME } from '../../constants'
import { execaWrapper } from '../execaWrapper'

export const leaveBridgeNetwork = async (containerId: string) => {
  const command = `docker network disconnect \
                    ${BRIDGE_NETWORK_NAME} \
                    ${containerId}`

  await execaWrapper(command)
}
