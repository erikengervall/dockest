import getDependsOn from './getDependsOn'
import getImage from './getImage'
import getPorts from './getPorts'
import { RunnerConfig, ComposeService } from '../@types'

const composeFileHelper = (runnerConfig: RunnerConfig): ComposeService => {
  const { dependsOn, image, build, service, ports, props, networks: userNetworks } = runnerConfig

  let networks
  if (userNetworks) {
    networks = userNetworks.reduce((acc: { [key: string]: null }, curr) => {
      acc[curr] = null
      return acc
    }, {})
  }

  return {
    ...getDependsOn(dependsOn),
    ...getImage({ image, build, service }),
    ...(build ? { build } : {}),
    ...(networks ? { networks } : {}),
    ports,
    ...props, // FIXME: Would love to type this stronger
  }
}

const defaultGetComposeService = (runnerConfig: RunnerConfig): ComposeService => ({
  ...composeFileHelper(runnerConfig),
})

export { defaultGetComposeService, getDependsOn, getImage, getPorts }
export default composeFileHelper
