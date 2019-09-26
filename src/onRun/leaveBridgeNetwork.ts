import execaWrapper from '../utils/execaWrapper'
import { BRIDGE_NETWORK_NAME } from '../constants'

export default async (containerId: string) => {
  const command = `
  docker network disconnect \
      ${BRIDGE_NETWORK_NAME} \
      ${containerId}
  `
  await execaWrapper(command)
}
