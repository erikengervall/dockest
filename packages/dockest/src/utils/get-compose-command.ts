import execa from 'execa'; // eslint-disable-line import/default

let composeCommand: string | null = null;

/**
 * The Compose CLI to invoke: the `docker compose` plugin when available, else the standalone `docker-compose`
 * binary. Resolved once per process.
 */
export const getComposeCommand = (): string => {
  if (composeCommand === null) {
    const { exitCode } = execa.sync('docker', ['compose', 'version'], { reject: false });
    composeCommand = exitCode === 0 ? 'docker compose' : 'docker-compose';
  }

  return composeCommand;
};

/** @testable */
export const resetComposeCommand = () => {
  composeCommand = null;
};
