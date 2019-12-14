import { BRIDGE_NETWORK_NAME } from '../../constants'
import { execaWrapper } from '../execaWrapper'

export const removeBridgeNetwork = async () => {
  const command = `docker network rm \
                    ${BRIDGE_NETWORK_NAME}`

  await execaWrapper(command)
}
