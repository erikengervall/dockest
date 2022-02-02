import { readFileSync } from 'fs'
import path from 'path'
import { DockestConfig } from '../../@types'
import { DockestError } from '../../Errors'
import { Logger } from '../../Logger'

const DOCKEST_COMPOSE_FILE_VERSION = 3.8

/**
 * `docker-compose config` trims the `version` property, so we need to inject it before outputting the generated compose file
 */
export function getComposeFilesWithVersion(
  composeFile: DockestConfig['composeFile'],
  mergedComposeFiles: string,
  /** @testable */
  nodeProcess = process,
) {
  const firstComposeFile = Array.isArray(composeFile) ? composeFile[0] : composeFile

  const firstComposeFileContent = readFileSync(path.join(nodeProcess.cwd(), firstComposeFile), { encoding: 'utf8' })
  const versionMatch = firstComposeFileContent.match(/version: '(\d\.\d|\d)'/)

  if (!versionMatch) {
    throw new DockestError(`Unable to find required field 'version' field in ${firstComposeFile}`)
  }

  let versionNumber = parseFloat(versionMatch[1])
  if (Math.trunc(versionNumber) < 3) {
    throw new DockestError(`Incompatible docker-compose file version (${versionNumber}). Please use >=3`)
  } else if (versionNumber < DOCKEST_COMPOSE_FILE_VERSION) {
    Logger.warn(
      `Outdated docker-compose file version (${versionNumber}). Automatically upgraded to '${DOCKEST_COMPOSE_FILE_VERSION}'.`,
    )

    versionNumber = DOCKEST_COMPOSE_FILE_VERSION
  }

  const mergedComposeFilesWithVersion = `version: '${versionNumber}'\n${mergedComposeFiles}`

  return {
    mergedComposeFilesWithVersion,
  }
}
