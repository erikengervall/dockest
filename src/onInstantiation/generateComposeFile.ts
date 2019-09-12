import { default as fsLib } from 'fs'
import { default as yamlLib } from 'js-yaml'
import { ComposeService, DependsOn } from '../runners/@types'
import { DockestConfig } from '../index'
import DockestError from '../errors/DockestError'

const { keys } = Object

export interface ComposeFile {
  version: string
  services: {
    [key: string]: ComposeService
  }
  networks?: {
    [key: string]: null
  }
  volumes?: {
    [key: string]: null
  }
}

const getDepComposeServices = (dependsOn: DependsOn) =>
  dependsOn.reduce(
    (composeServices: { [key: string]: ComposeService }, { runnerConfig: { service }, getComposeService }) => ({
      ...composeServices,
      [service]: getComposeService(),
    }),
    {},
  )

export default (config: DockestConfig, yaml = yamlLib, fs = fsLib) => {
  const composeFile: ComposeFile = {
    version: '3',
    services: {},
  }

  config.runners.forEach(runner => {
    const {
      runnerConfig: { service, dependsOn },
      getComposeService,
    } = runner

    const composeService = getComposeService()
    const depComposeServices = getDepComposeServices(dependsOn)

    composeFile.services = {
      ...composeFile.services,
      [service]: composeService,
      ...depComposeServices,
    }
  })

  const servicesWithNetworks = keys(composeFile.services).filter(
    service => composeFile.services[service].networks !== undefined,
  )
  if (servicesWithNetworks.length > 0) {
    composeFile.networks = servicesWithNetworks.reduce(
      (networks, service) => ({
        ...networks,
        ...composeFile.services[service].networks,
      }),
      {},
    )
  }

  const servicesWithVolumes = keys(composeFile.services).filter(
    service => composeFile.services[service].volumes !== undefined,
  )
  if (servicesWithVolumes.length > 0) {
    composeFile.volumes = servicesWithVolumes.reduce(
      (volumes, service) => ({
        ...volumes,
        ...composeFile.services[service].volumes,
      }),
      {},
    )
  }
  const yml = yaml.safeDump(composeFile)

  try {
    fs.writeFileSync(`${process.cwd()}/docker-compose-dockest.yml`, yml)
  } catch (error) {
    throw new DockestError(`Something went wrong when generating the docker-compose file: ${error.message}`)
  }
}
