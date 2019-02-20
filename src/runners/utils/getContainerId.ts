import execa from 'execa'
import { RunnerLogger } from '../../loggers'

export default async (serviceName: string): Promise<string> => {
  const cmd = `docker ps \
                  --quiet \
                  --filter \
                  "name=${serviceName}" \
                  --latest`
  RunnerLogger.shellCmd(cmd)
  const { stdout: containerId } = await execa.shell(cmd)

  return containerId
}
