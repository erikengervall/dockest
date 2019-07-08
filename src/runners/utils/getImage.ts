import fs from 'fs'
import yaml from 'js-yaml'
import ConfigurationError from '../../errors/ConfigurationError'

const getImage = ({
  composeFileName,
  image: runnerConfigProvidedImage,
  mockProcess,
  service,
}: {
  composeFileName: string
  image?: string
  mockProcess?: any
  service: string
}): { image: string } => {
  const nodeProcess = mockProcess || process

  if (typeof runnerConfigProvidedImage === 'string' && runnerConfigProvidedImage.length > 0) {
    return {
      image: runnerConfigProvidedImage,
    }
  }

  let imageFromComposeFile = null
  let dockerCompose = null

  try {
    const path = `${nodeProcess.cwd()}/${composeFileName}`
    dockerCompose = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
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
