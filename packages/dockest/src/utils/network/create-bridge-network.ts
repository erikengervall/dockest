import { BRIDGE_NETWORK_NAME } from '../../constants';
import { execaWrapper } from '../execa-wrapper';

export const createBridgeNetwork = async () => {
  const command = `docker network create \
                    --driver bridge \
                    ${BRIDGE_NETWORK_NAME}`;

  await execaWrapper(command);
};
