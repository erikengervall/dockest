import execa, { SyncOptions } from 'execa'; // eslint-disable-line import/default
import { trim } from './trim';
import { Runner } from '../@types';
import { Logger } from '../logger';

interface Opts {
  runner?: Runner;
  logPrefix?: string;
  logStdout?: boolean;
  execaOpts?: SyncOptions<string>;
}

export const execaWrapper = (
  command: string,
  { runner, logPrefix = '[Shell]', logStdout = false, execaOpts = {} }: Opts = {},
) => {
  const trimmedCommand = trim(command);
  const logger = runner ? runner.logger : Logger;

  logger.debug(`${logPrefix} <${trimmedCommand}>`);

  const result = execa.commandSync(trimmedCommand, {
    shell: true,
    ...execaOpts,
  });

  logStdout && logger.debug(`${logPrefix} Success (${result.stdout})`, { success: true });

  return result;
};
