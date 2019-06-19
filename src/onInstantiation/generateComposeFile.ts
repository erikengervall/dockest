import fs from 'fs'
import yaml from 'js-yaml'
import { DockestConfig } from '..'
import { DockestError } from '../errors'
import { ComposeFile, Runner } from '../runners'

const generateComposeFile = (config: DockestConfig) => {
  const composeFile = {
    version: '3',
    services: {},
  }

  for (const runner of config.runners) {
    const {
      runnerConfig: { dependsOn },
      getComposeService,
    } = runner
    const composeService = getComposeService(config.dockerComposeFileName)

    const depComposeServices = dependsOn.reduce(
      (composeServices: { [key: string]: ComposeFile }, runner: Runner) => {
        const {
          runnerConfig: { service },
          getComposeService,
        } = runner
        composeServices[service] = getComposeService(config.dockerComposeFileName)[service]

        return composeServices
      },
      {}
    )

    composeFile.services = {
      ...composeFile.services,
      ...composeService,
      ...depComposeServices,
    }
  }

  const yml = yaml.safeDump(composeFile)

  try {
    fs.writeFileSync(`${config.DOCKER_COMPOSE_GENERATED_PATH}`, yml)
  } catch (error) {
    throw new DockestError(
      `Something went wrong when generating the docker-compose file: ${error.message}`
    )
  }
}

export default generateComposeFile
