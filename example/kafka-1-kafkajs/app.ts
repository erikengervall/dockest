import dotenv from 'dotenv'
import { Kafka } from 'kafkajs'

const env: any = dotenv.config().parsed

const createKafka = () => {
  const kafka = new Kafka({
    clientId: 'dockest/example',
    brokers: [env.kafka_broker],
    // ssl: { rejectUnauthorized: false },
  })

  return kafka
}

const main = () => {
  const kafka = createKafka()

  // TODO: Fire up a consumer and produce test events

  return {
    kafka,
  }
}

export default main
