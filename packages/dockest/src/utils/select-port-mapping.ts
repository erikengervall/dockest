import { DockerComposePortFormat } from '../@types'

export const selectPortMapping = (input: DockerComposePortFormat | string) => {
  if (typeof input !== 'string') {
    return input
  }

  const [published, target] = input.split(':')
  return { published: parseInt(published, 10), target: parseInt(target, 10) }
}
