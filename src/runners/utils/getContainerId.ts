import { execa } from './index'

export default async (serviceName: string): Promise<string> => {
  const cmd = `docker ps \
                  --quiet \
                  --filter \
                  "name=${serviceName}" \
                  --latest`
  const containerId = await execa(cmd)

  return containerId
}
