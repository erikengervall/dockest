import { ComposeService, DependsOn, ComposeFile } from '../../runners/@types'
import { DockestConfig } from '../../index'

const { keys } = Object

const getDepComposeServices = (dependsOn: DependsOn) =>
  dependsOn.reduce(
    (composeServices: { [key: string]: ComposeService }, { runnerConfig: { service }, getComposeService }) => ({
      ...composeServices,
      [service]: getComposeService(),
    }),
    {},
  )

export default (config: DockestConfig, dockerComposeFileVersion: string) => {
  const composeObj: ComposeFile = {
    version: dockerComposeFileVersion,
    services: {},
  }

  config.runners.forEach(runner => {
    const {
      runnerConfig: { service, dependsOn },
      getComposeService,
    } = runner

    const composeService = getComposeService()
    const depComposeServices = getDepComposeServices(dependsOn)

    composeObj.services = {
      ...composeObj.services,
      [service]: { ...composeService },
      ...depComposeServices,
    }
  })

  const servicesWithNetworks = keys(composeObj.services).filter(
    service => composeObj.services[service].networks !== undefined,
  )
  if (servicesWithNetworks.length > 0) {
    composeObj.networks = servicesWithNetworks.reduce(
      (networks, service) => ({
        ...networks,
        ...composeObj.services[service].networks,
      }),
      {},
    )
  }

  const servicesWithVolumes = keys(composeObj.services).filter(
    service => composeObj.services[service].volumes !== undefined,
  )
  if (servicesWithVolumes.length > 0) {
    composeObj.volumes = servicesWithVolumes.reduce(
      (volumes, service) => ({
        ...volumes,
        ...composeObj.services[service].volumes,
      }),
      {},
    )
  }

  return composeObj
}
