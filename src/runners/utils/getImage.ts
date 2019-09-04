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
  image?: string | null
  mockProcess?: any
  service: string
}): { image: string } | {} => {
  const nodeProcess = mockProcess || process

  if (runnerConfigProvidedImage === null) {
    return {}
  }

  if (typeof runnerConfigProvidedImage === 'string' && runnerConfigProvidedImage.length > 0) {
    return {
      image: runnerConfigProvidedImage,
    }
  }

  let imageFromComposeFile = null
  let dockerCompose = null
  const path = `${nodeProcess.cwd()}/${composeFileName}`

  try {
    dockerCompose = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
  } catch (error) {
    throw new ConfigurationError(`Failed to parse '${path}' (${error.message})`)
  }

  try {
    imageFromComposeFile = dockerCompose.services[service].image
  } catch (error) {
    throw new ConfigurationError(`Image not found for service ${service}`)
  }

  if (typeof imageFromComposeFile === 'string' && imageFromComposeFile.length > 0) {
    return {
      image: imageFromComposeFile,
    }
  }

  throw new ConfigurationError(`${service} Invalid image found: ${imageFromComposeFile}`)
}

export default getImage
