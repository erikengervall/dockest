import dotenv from 'dotenv'
import { Kafka } from 'kafkajs'

const env: any = dotenv.config().parsed

const createKafka = () => {
  const kafka = new Kafka({
    clientId: 'dockest/example',
    brokers: [env.KAFKA_HOST],
    // ssl: { rejectUnauthorized: false },
  })

  return kafka
}

export default createKafka
