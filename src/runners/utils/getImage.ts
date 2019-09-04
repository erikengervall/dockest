import fs from 'fs'
import yaml from 'js-yaml'
import ConfigurationError from '../../errors/ConfigurationError'
import { Props } from '../@types'

const getImage = ({
  composeFileName,
  image: runnerConfigProvidedImage,
  mockProcess,
  service,
  props,
}: {
  composeFileName: string
  image?: string
  mockProcess?: any
  service: string
  props: Props
}): { image: string } | {} => {
  /**
   * If user provided an image via interface
   */
  if (typeof runnerConfigProvidedImage === 'string' && runnerConfigProvidedImage.length > 0) {
    return {
      image: runnerConfigProvidedImage,
    }
  }

  /**
   * If user provided a build path to a Dockerfile
   */
  if (props.build) {
    return {}
  }

  /**
   * Finally, if none of the above is provided
   * the Compose file is parsed
   */
  let imageFromComposeFile = null
  let composeFile = null
  const path = `${(mockProcess || process).cwd()}/${composeFileName}`

  try {
    composeFile = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
  } catch (error) {
    throw new ConfigurationError(`Failed to parse '${path}' (${error.message})`)
  }

  try {
    imageFromComposeFile = composeFile.services[service].image
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
