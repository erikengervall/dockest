import execa from 'execa'

// import fs from 'fs'
import { DockestError } from '../../errors'
import { acquireConnection, getContainerId, sleep } from '../../utils/execs'
import logger from '../../utils/logger'
import { teardownSingle } from '../../utils/teardown'
import { IKafkaRunnerConfig } from './index'

interface IExec {
  start: (runnerConfig: IKafkaRunnerConfig) => Promise<string>
  checkHealth: (runnerConfig: IKafkaRunnerConfig) => Promise<void>
  teardown: (containerId: string, runnerKey: string) => Promise<void>
}

class KafkaExec implements IExec {
  private static instance: KafkaExec

  constructor() {
    if (KafkaExec.instance) {
      return KafkaExec.instance
    }

    KafkaExec.instance = this
  }

  public start = async (runnerConfig: IKafkaRunnerConfig) => {
    logger.loading('Starting kafka container')

    const { ports, service } = runnerConfig
    const stringifiedPorts = Object.keys(ports)
      .map(port => `--publish ${ports[port]}:${port}`)
      .join(' ')
    let containerId = ''
    let hostIp

    // if (!fs.existsSync('/sbin/ifconfig')) {
    //   const { stdout } = await execa.shell(
    //     `ip addr | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1 | awk -F '/' '{ print $1 }'`
    //   )
    //   hostIp = stdout
    // } else {
    //   const { stdout } = await execa.shell(
    //     `ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1`
    //   )
    //   hostIp = stdout
    // }

    hostIp = `"localhost"`

    containerId = await getContainerId(service)
    if (!containerId) {
      const env = `-e kafka_hostname="" -e kafka_advertised_hostname=${hostIp} -e kafka_auto_create_topics_enable=true`
      await execa.shell(`docker-compose run --detach ${stringifiedPorts} ${env} ${service}`)
    }

    containerId = await getContainerId(service)

    logger.success(`Kafka container started successfully`)

    return containerId
  }

  public checkHealth = async (runnerConfig: IKafkaRunnerConfig) => {
    await this.checkConnection(runnerConfig)
  }

  public teardown = async (containerId: string, runnerKey: string) =>
    teardownSingle(containerId, runnerKey)

  private checkConnection = async (runnerConfig: IKafkaRunnerConfig) => {
    logger.loading('Attempting to establish Kafka connection')

    const { connectionTimeout = 5000 } = runnerConfig

    const recurse = async (connectionTimeout: number) => {
      logger.loading(`Establishing Kafka connection (Timing out in: ${connectionTimeout}s)`)

      if (connectionTimeout <= 0) {
        throw new DockestError('Kafka connection timed out')
      }

      try {
        await acquireConnection(9092)

        logger.success('Kafka connection established')
      } catch (error) {
        connectionTimeout--

        await sleep(1000)
        await recurse(connectionTimeout)
      }
    }

    await recurse(connectionTimeout)
  }
}

export default KafkaExec
