import ConfigurationError from '../../errors/ConfigurationError'

const getImage = ({
  build,
  image,
  service,
}: {
  build?: string
  image?: string
  service: string
}): { image: string } | {} => {
  /**
   * If user provided an image via interface
   */
  if (typeof image === 'string' && image.length > 0) {
    return {
      image,
    }
  }

  /**
   * If user provided a build path to a Dockerfile
   */
  if (build) {
    return {}
  }

  throw new ConfigurationError(`${service} Could not determine "image" property for service`)
}

export default getImage
