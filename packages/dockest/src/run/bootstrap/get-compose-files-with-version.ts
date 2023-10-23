import { readFileSync } from 'fs';
import path from 'path';
import { DockerComposeFile, DockestConfig } from '../../@types';
import { DockestError } from '../../errors';
import { Logger } from '../../logger';

const DOCKEST_COMPOSE_FILE_VERSION = 3.8;
const VERSION_REG_EXP = /version: .?(\d\.\d|\d).?/;

/**
 * `docker-compose config` trims the `version` property, so we need to inject it before outputting the generated compose file
 */
export function getComposeFilesWithVersion(
  composeFile: DockestConfig['composeFile'],
  dockerComposeFile: Omit<DockerComposeFile, 'version'> & { version?: string },
  /** @testable */
  nodeProcess = process,
): {
  dockerComposeFileWithVersion: DockerComposeFile;
} {
  let versionNumber: string | number | undefined = dockerComposeFile.version;

  if (!versionNumber) {
    const firstComposeFile = Array.isArray(composeFile) ? composeFile[0] : composeFile;
    const firstComposeFileContent = readFileSync(path.join(nodeProcess.cwd(), firstComposeFile), { encoding: 'utf8' });
    const versionMatch = firstComposeFileContent.match(VERSION_REG_EXP);

    if (!versionMatch) {
      throw new DockestError(`Unable to find required field 'version' field in ${firstComposeFile}`);
    }

    versionNumber = versionMatch[1];
  }

  versionNumber = parseFloat(versionNumber);
  if (Math.trunc(versionNumber) < 3) {
    throw new DockestError(`Incompatible docker-compose file version (${versionNumber}). Please use >=3`);
  } else if (versionNumber < DOCKEST_COMPOSE_FILE_VERSION) {
    Logger.warn(
      `Outdated docker-compose file version (${versionNumber}). Automatically upgraded to '${DOCKEST_COMPOSE_FILE_VERSION}'.`,
    );

    versionNumber = DOCKEST_COMPOSE_FILE_VERSION;
  }

  return {
    dockerComposeFileWithVersion: {
      ...dockerComposeFile,
      version: versionNumber.toString(),
    },
  };
}
