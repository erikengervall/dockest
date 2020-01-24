import { DockestConfig } from '../../@types'
import { execaWrapper } from '../../utils/execaWrapper'
import { GENERATED_COMPOSE_FILE_PATH } from '../../constants'

export const dockerComposeUp = async (config: DockestConfig, servicesToStart: string) => {
  const {
    opts: {
      composeOpts: { alwaysRecreateDeps, build, forceRecreate, noBuild, noColor, noDeps, noRecreate, quietPull },
    },
  } = config

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
                    ${servicesToStart}`

  await execaWrapper(command)
}
