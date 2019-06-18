import fs from 'fs'
import yaml from 'js-yaml'
import { ConfigurationError } from '../errors'

const getImage = (service: string, dockerComposeFileName: string): string => {
  let image = null
  let dockerCompose = null

  try {
    dockerCompose = yaml.safeLoad(
      fs.readFileSync(`${process.cwd()}/${dockerComposeFileName}`, 'utf8')
    )
    image = dockerCompose.services[service].image
  } catch (e) {
    throw new Error(`Failed to parse ${dockerComposeFileName}`)
  }

  if (!image || typeof image !== 'string' || (typeof image === 'string' && image.length === 0)) {
    throw new ConfigurationError(`${service} Invalid image found: ${image}`)
  }

  return image
}

export default getImage
