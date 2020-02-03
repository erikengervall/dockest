import fs from 'fs'
import { DockerComposeFile } from '../../@types'
import { GENERATED_COMPOSE_FILE_PATH, DOCKEST_ATTACH_TO_PROCESS } from '../../constants'

export const writeComposeFile = (mergedComposeFiles: string, composeFileAsObject: DockerComposeFile): string => {
  // set environment variable that can be used with the test-helpers
  // jest.runCLI will pass this environment variable into the testcase runners
  process.env[DOCKEST_ATTACH_TO_PROCESS] = JSON.stringify(composeFileAsObject)

  fs.writeFileSync(GENERATED_COMPOSE_FILE_PATH, mergedComposeFiles)
  return GENERATED_COMPOSE_FILE_PATH
}
