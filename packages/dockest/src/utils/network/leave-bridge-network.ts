import { BRIDGE_NETWORK_NAME } from '../../constants';
import { execaWrapper } from '../execa-wrapper';

export const leaveBridgeNetwork = ({ containerId }: { containerId: string }): void => {
  const command = `docker network disconnect \
                    ${BRIDGE_NETWORK_NAME} \
                    ${containerId}`;

  execaWrapper(command);
};
