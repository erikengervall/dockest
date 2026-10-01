import { DockestConfig } from '../../@types';
import { GENERATED_COMPOSE_FILE_PATH } from '../../constants';
import { execaWrapper } from '../../utils/execa-wrapper';
import { getComposeCommand } from '../../utils/get-compose-command';
import { shellQuote } from '../../utils/shell-quote';

export const dockerComposeUp = async ({
  composeOpts: { alwaysRecreateDeps, build, forceRecreate, noBuild, noColor, noDeps, noRecreate, quietPull },
  serviceName,
}: {
  composeOpts: DockestConfig['composeOpts'];
  serviceName: string;
}) => {
  const command = `${getComposeCommand()} \
                    -f ${shellQuote(GENERATED_COMPOSE_FILE_PATH)} \
                    up \
                    ${alwaysRecreateDeps ? '--always-recreate-deps' : ''} \
                    ${build ? '--build' : ''} \
                    ${forceRecreate ? '--force-recreate' : ''} \
                    ${noBuild ? '--no-build' : ''} \
                    ${noColor ? '--no-color' : ''} \
                    ${noDeps ? '--no-deps' : ''} \
                    ${noRecreate ? '--no-recreate' : ''} \
                    ${quietPull ? '--quiet-pull' : ''} \
                    --detach \
                    ${serviceName}`;

  execaWrapper(command);
};
