import execa from 'execa'
import { runnerLogger } from '../../loggers'

export default async (serviceName: string): Promise<string> => {
  const cmd = `docker ps \
                  --quiet \
                  --filter \
                  "name=${serviceName}" \
                  --latest`
  runnerLogger.shellCmd(cmd)
  const { stdout: containerId } = await execa.shell(cmd)

  return containerId
}
