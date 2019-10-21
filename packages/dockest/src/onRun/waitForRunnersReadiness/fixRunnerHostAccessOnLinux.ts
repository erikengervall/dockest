import { Runner } from '../../runners/@types'
import { execa } from '../../index'

export default async (runner: Runner) => {
  const command = ` \
    docker exec ${runner.containerId} \
      /bin/sh -c "ip -4 route list match 0/0 | awk '{print \\$3\\" host.docker.internal\\"}' >> /etc/hosts"
  `
  await execa(command).catch(() => {
    runner.logger.debug(
      'Fixing the host container access failed. This could be related due to the container having already stopped.',
    )
  })
}
