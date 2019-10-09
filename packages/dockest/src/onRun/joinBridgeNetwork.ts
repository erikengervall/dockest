import execaWrapper from '../utils/execaWrapper'
import { BRIDGE_NETWORK_NAME } from '../constants'

export default async (containerId: string, alias?: string) => {
  const command = `
    docker network connect \
      ${BRIDGE_NETWORK_NAME} \
      ${alias ? `--alias ${alias}` : ''} \
      ${containerId}
  `
  await execaWrapper(command)
}
