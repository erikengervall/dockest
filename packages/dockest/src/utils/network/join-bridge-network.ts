import { BRIDGE_NETWORK_NAME } from '../../constants';
import { execaWrapper } from '../execa-wrapper';

export const joinBridgeNetwork = async ({ containerId, alias }: { containerId: string; alias: string }) => {
  const command = `docker network connect \
                    ${BRIDGE_NETWORK_NAME} \
                    ${`--alias ${alias}`} \
                    ${containerId}`;

  await execaWrapper(command);
};
