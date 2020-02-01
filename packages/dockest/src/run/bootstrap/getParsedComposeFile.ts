import { safeLoad } from 'js-yaml'
import { DockerComposeFile } from '../../@types'
import { DockestError } from '../../Errors'
import { Logger } from '../../Logger'

export const getParsedComposeFile = (mergedComposeFiles: string) => {
  const dockerComposeFile: DockerComposeFile = safeLoad(mergedComposeFiles)

  const versionNumber = parseFloat(dockerComposeFile.version)
  if (Math.trunc(versionNumber) < 3) {
    throw new DockestError(`Incompatible docker-compose file version. Please use version '3.x'`)
  } else if (versionNumber !== 3.7) {
    Logger.warn(`You should upgrade to docker-compose file version '3.7'. Dockest automatically uses that version`)
    dockerComposeFile.version = '3.7'
  }

  return {
    dockerComposeFile,
  }
}
