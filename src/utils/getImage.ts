import fs from 'fs'
import yaml from 'js-yaml'
import { ConfigurationError } from '../errors'

const getImage = ({
  composeFileName,
  image: configProvidedImage,
  service,
}: {
  composeFileName: string
  image?: string
  service: string
}): string => {
  if (typeof configProvidedImage === 'string' && configProvidedImage.length > 0) {
    return configProvidedImage
  }

  let imageFromComposeFile = null
  let dockerCompose = null

  try {
    dockerCompose = yaml.safeLoad(fs.readFileSync(`${process.cwd()}/${composeFileName}`, 'utf8'))
    imageFromComposeFile = dockerCompose.services[service].image
  } catch (e) {
    throw new Error(`Failed to parse ${composeFileName}`)
  }

  if (typeof imageFromComposeFile === 'string' && imageFromComposeFile.length > 0) {
    return imageFromComposeFile
  }

  throw new ConfigurationError(`${service} Invalid image found: ${imageFromComposeFile}`)
}

export default getImage
