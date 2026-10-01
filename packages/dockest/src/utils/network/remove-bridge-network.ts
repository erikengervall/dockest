import { BRIDGE_NETWORK_NAME } from '../../constants';
import { execaWrapper } from '../execa-wrapper';

export const removeBridgeNetwork = (): void => {
  const command = `docker network rm \
                    ${BRIDGE_NETWORK_NAME}`;

  execaWrapper(command);
};
