import execa from 'execa'
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

  const extra_hosts: string[] = []

  if (!config.$.isInsideDockerContainer) {
    if (process.platform === 'linux') {
      const command = `ip -4 addr show docker0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'`
      const result = execa.sync(command, { reject: false })
      extra_hosts.push(`host.docker.internal:${result.stdout}`)
    }
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
      [service]: { ...composeService, extra_hosts },
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
