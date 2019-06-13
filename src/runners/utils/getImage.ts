import fs from 'fs'
import yaml from 'js-yaml'
import { ConfigurationError } from '../../errors'
import Dockest from '../../index'

const getImage = (service: string): string => {
  // TODO: Make a util out of this
  let image = null
  let dockerCompose = null
  try {
    dockerCompose = yaml.safeLoad(
      fs.readFileSync(`${process.cwd()}/${Dockest.config.dockerComposeFileName}`, 'utf8')
    )
    image = dockerCompose.services[service].image
  } catch (e) {
    throw new Error(`Failed to parse ${Dockest.config.dockerComposeFileName} file`)
  }

  if (!image) {
    throw new ConfigurationError(`Could not find valid image for service: ${service}`)
  }

  return image
}

export default getImage
