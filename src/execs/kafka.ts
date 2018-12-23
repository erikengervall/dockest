import execa from 'execa'

import { IKafkaConfig$Int } from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import DockestError from '../error/DockestError'
import { sleep } from './utils'

type startKafkaContainer = (kafkaConfig: IKafkaConfig$Int) => Promise<void>
type checkKafkaConnection = (kafkaConfig: IKafkaConfig$Int) => Promise<void>

export interface IKafka {
  startKafkaContainer: startKafkaContainer;
  checkKafkaConnection: checkKafkaConnection;
}

const createKafka = (Logger: DockestLogger): IKafka => {
  const startKafkaContainer: startKafkaContainer = async kafkaConfig => {
    Logger.loading('Starting Kafka container')
    const { label, port } = kafkaConfig
    const dockerComposeFile = '' // `-f ${Config.getConfig().dockest.dockerComposeFile}` || ''

    const { stdout: hostIp } = await execa(
      `ifconfig 
      | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" 
      | grep -v 127.0.0.1 
      | awk '{ print $2 }' 
      | cut -f2 -d: 
      | head -n1`
    )
    Logger.info(`Current machines local IP: ${hostIp}`)

    await execa.shell(
      `docker-compose run -d ${dockerComposeFile} 
      --label ${label} 
      -p ${port}:${port} 
      -e kafka_hostname="" 
      -e kafka_advertised_hostname=${hostIp} 
      -e kafka_auto_create_topics_enable=true kafka`
    )
    Logger.success('Kafka container started successfully')
  }

  const checkKafkaConnection: checkKafkaConnection = async kafkaConfig => {
    Logger.loading('Attempting to establish Kafka connection')

    const { connectionTimeout: timeout = 3 } = kafkaConfig

    const recurse = async (timeout: number) => {
      Logger.info(`Establishing Kafka connection (Timing out in: ${timeout}s)`)

      if (timeout <= 0) {
        throw new DockestError('Kafka connection timed out')
      }

      try {
        await execa.shell(`curl -s -o /dev/null -w "%{http_code}" http://localhost:9082`)

        Logger.success('Kafka connection established')
      } catch (error) {
        timeout--

        await sleep(1000)
        await recurse(timeout)
      }
    }

    await recurse(timeout)
  }

  return {
    startKafkaContainer,
    checkKafkaConnection,
  }
}

export default createKafka
