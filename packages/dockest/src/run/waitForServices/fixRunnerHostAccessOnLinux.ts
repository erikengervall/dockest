import { Runner } from '../../@types';
import { DEFAULT_HOST_NAME } from '../../constants';
import { execaWrapper } from '../../utils/execa-wrapper';

export const fixRunnerHostAccessOnLinux = async ({ containerId, logger }: Runner) => {
  const command = `docker exec ${containerId} \
                    /bin/sh -c "ip -4 route list match 0/0 \
                    | awk '{print \\$3\\" ${DEFAULT_HOST_NAME}\\"}' \
                    >> /etc/hosts"`;

  try {
    execaWrapper(command);
  } catch (err) {
    logger.debug(
      'Fixing the host container access failed. This could be related to the container having already been stopped',
    );
  }
};
