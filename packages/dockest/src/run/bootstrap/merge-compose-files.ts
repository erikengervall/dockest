import path from 'path';
import { DockestConfig } from '../../@types';
import { DockestError } from '../../errors';
import { execaWrapper } from '../../utils/execa-wrapper';

export async function mergeComposeFiles(composeFile: DockestConfig['composeFile'], nodeProcess = process) {
  const composeFiles = [];
  if (Array.isArray(composeFile)) {
    composeFiles.push(...composeFile);
  } else {
    composeFiles.push(composeFile);
  }

  const dockerComposeConfigCommand = `${composeFiles.reduce(
    (commandAcc, composePath) => (commandAcc += ` -f ${path.join(nodeProcess.cwd(), composePath)}`),
    'docker-compose',
  )} config`;

  const { stderr, exitCode, stdout } = execaWrapper(dockerComposeConfigCommand, {
    execaOpts: { reject: false },
    logStdout: true,
  });

  let mergedComposeFiles = stdout;

  if (exitCode !== 0) {
    throw new DockestError('Invalid Compose file(s)', {
      error: stderr,
    });
  }

  // For some reason the published ports are wrapped in quotes, so we remove them for consistency
  mergedComposeFiles = mergedComposeFiles.replace(/published: "(\d{4})"/g, 'published: $1');
  mergedComposeFiles = mergedComposeFiles.replace(/ZOOKEEPER_CLIENT_PORT: "(\d{4})"/g, 'ZOOKEEPER_CLIENT_PORT: $1');

  return {
    mergedComposeFiles,
  };
}
