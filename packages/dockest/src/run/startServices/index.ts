import { dockerComposeUp } from './dockerComposeUp'
import { bridgeNetworkExists } from '../../utils/network/bridgeNetworkExists'
import { createBridgeNetwork } from '../../utils/network/createBridgeNetwork'
import { DOCKEST_HOST_ADDRESS } from '../../constants'
import { DockestConfig } from '../../@types'
import { joinBridgeNetwork } from '../../utils/network/joinBridgeNetwork'

export const startServices = async (config: DockestConfig) => {
  const {
    $: { isInsideDockerContainer, hostname, runners },
  } = config

  await dockerComposeUp(runners.map(runner => runner.dockestService.serviceName))

  if (isInsideDockerContainer) {
    if (!(await bridgeNetworkExists())) {
      await createBridgeNetwork()
    }

    await joinBridgeNetwork(hostname, DOCKEST_HOST_ADDRESS)
  }
}
