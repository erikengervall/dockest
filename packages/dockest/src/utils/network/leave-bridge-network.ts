import { BRIDGE_NETWORK_NAME } from '../../constants';
import { execaWrapper } from '../execa-wrapper';

export const leaveBridgeNetwork = async ({ containerId }: { containerId: string }) => {
  const command = `docker network disconnect \
                    ${BRIDGE_NETWORK_NAME} \
                    ${containerId}`;

  await execaWrapper(command);
};
