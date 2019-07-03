import fs from 'fs'
import yaml from 'js-yaml'
import { ConfigurationError } from '../errors'

const getImage = ({
  composeFileName,
  image: runnerConfigProvidedImage,
  service,
}: {
  composeFileName: string
  image?: string
  service: string
}): { image: string } => {
  if (typeof runnerConfigProvidedImage === 'string' && runnerConfigProvidedImage.length > 0) {
    return {
      image: runnerConfigProvidedImage,
    }
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
    return {
      image: imageFromComposeFile,
    }
  }

  throw new ConfigurationError(`${service} Invalid image found: ${imageFromComposeFile}`)
}

export default getImage
