import path from 'path';
import { DockestConfig } from '../../@types';
import { DockestError } from '../../errors';
import { execaWrapper } from '../../utils/execa-wrapper';
import { getComposeCommand } from '../../utils/get-compose-command';
import { shellQuote } from '../../utils/shell-quote';

export async function mergeComposeFiles(composeFile: DockestConfig['composeFile'], nodeProcess = process) {
  const composeFiles = Array.isArray(composeFile) ? composeFile : [composeFile];

  const fileArgs = composeFiles
    .map((composePath) => `-f ${shellQuote(path.resolve(nodeProcess.cwd(), composePath))}`)
    .join(' ');

  const { stderr, exitCode, stdout } = execaWrapper(`${getComposeCommand()} ${fileArgs} config`, {
    execaOpts: { reject: false },
    logStdout: true,
  });

  if (exitCode !== 0) {
    throw new DockestError('Invalid Compose file(s)', {
      error: stderr,
    });
  }

  return {
    mergedComposeFiles: stdout,
  };
}
