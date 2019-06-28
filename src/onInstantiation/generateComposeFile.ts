import fs from 'fs'
import yaml from 'js-yaml'
import { DockestError } from '../errors'
import { DockestConfig } from '../index'
import { ComposeFile, Runner } from '../runners/@types'

const generateComposeFile = (config: DockestConfig) => {
  const {
    $: { dockerComposeGeneratedPath },
    opts: { dockerComposeFileName },
  } = config
  const composeFile = {
    version: '3',
    services: {},
  }

  for (const runner of config.runners) {
    const {
      runnerConfig: { dependsOn },
      getComposeService,
    } = runner
    const composeService = getComposeService(dockerComposeFileName)

    const depComposeServices = dependsOn.reduce(
      (composeServices: { [key: string]: ComposeFile }, runner: Runner) => {
        const {
          runnerConfig: { service },
          getComposeService,
        } = runner
        composeServices[service] = getComposeService(dockerComposeFileName)[service]

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
    fs.writeFileSync(`${dockerComposeGeneratedPath}`, yml)
  } catch (error) {
    throw new DockestError(
      `Something went wrong when generating the docker-compose file: ${error.message}`
    )
  }
}

export default generateComposeFile
