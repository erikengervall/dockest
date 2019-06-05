import { execa } from './index'

const getContainerId = async (serviceName: string): Promise<string> => {
  const cmd = `docker ps \
                  --quiet \
                  --filter \
                  "name=${serviceName}" \
                  --latest`
  const containerId = await execa(cmd)

  return containerId
}

export default getContainerId
