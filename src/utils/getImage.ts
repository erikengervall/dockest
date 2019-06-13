import fs from 'fs'
import yaml from 'js-yaml'
import { ConfigurationError } from '../errors'

const getImage = (service: string, dockerComposeFileName: string): string => {
  // TODO: Make a util out of this
  let image = null
  let dockerCompose = null
  try {
    dockerCompose = yaml.safeLoad(
      fs.readFileSync(`${process.cwd()}/${dockerComposeFileName}`, 'utf8')
    )
    image = dockerCompose.services[service].image
  } catch (e) {
    throw new Error(`Failed to parse ${dockerComposeFileName} file`)
  }

  if (!image) {
    throw new ConfigurationError(`Could not find valid image for service: ${service}`)
  }

  return image
}

export default getImage
