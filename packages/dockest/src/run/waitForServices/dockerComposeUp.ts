import { DockestConfig } from '../../@types'
import { execaWrapper } from '../../utils/execaWrapper'
import { GENERATED_COMPOSE_FILE_PATH } from '../../constants'

export const dockerComposeUp = async (
  {
    alwaysRecreateDeps,
    build,
    forceRecreate,
    noBuild,
    noColor,
    noDeps,
    noRecreate,
    quietPull,
  }: DockestConfig['composeOpts'],
  serviceName: string,
) => {
  const command = `docker-compose \
                    -f ${`${GENERATED_COMPOSE_FILE_PATH}`} \
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
                    ${serviceName}`

  await execaWrapper(command)
}
