import { Logger } from '../../logger';
import { execaWrapper } from '../execa-wrapper';
import { shellQuote } from '../shell-quote';

/**
 * Remove the networks Compose created for the project. A network still in use by containers outside of Dockest
 * fails to remove and is left alone.
 */
export const removeProjectNetworks = (projectName: string): void => {
  const { stdout } = execaWrapper(
    `docker network ls --filter ${shellQuote(`label=com.docker.compose.project=${projectName}`)} --quiet`,
    { execaOpts: { reject: false } },
  );

  for (const networkId of stdout.split('\n').filter(Boolean)) {
    const { exitCode, stderr } = execaWrapper(`docker network rm ${networkId}`, { execaOpts: { reject: false } });
    if (exitCode !== 0) {
      Logger.debug(`[Teardown] Kept network ${networkId}: ${stderr}`);
    }
  }
};
