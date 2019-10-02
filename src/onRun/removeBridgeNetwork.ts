import execaWrapper from '../utils/execaWrapper'
import { BRIDGE_NETWORK_NAME } from '../constants'

export default async () => {
  const command = `
  docker network rm \
      ${BRIDGE_NETWORK_NAME}
  `
  await execaWrapper(command)
}
