import execaWrapper from '../utils/execaWrapper'

const dockerComposeUp = async () => {
  const command = ` \
              docker-compose \
              -f ${`${process.cwd()}/docker-compose-dockest.yml`} \
              up \
              --force-recreate \
              --build \
              --detach \
            `

  await execaWrapper(command)
}

export default dockerComposeUp
