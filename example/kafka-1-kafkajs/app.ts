import dotenv from 'dotenv'

/* tslint:disable */
// @ts-ignore
const { Kafka, logLevel } = require('kafkajs')

const env: any = dotenv.config().parsed

const createConsumer = async ({ kafka, indicateConsumption }) => {
  const consumer = kafka.consumer({ groupId: env.kafka1confluentinc_consumer_group_id })

  await consumer.connect()
  await consumer.subscribe({ topic: env.kafka1confluentinc_topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = {
        topic,
        partition,
        messageKey: message.key.toString(),
        messageValue: message.value.toString(),
        messageHeaders: message.headers,
      }
      console.log('eachMessage ran with payload:', payload)
      indicateConsumption(payload)
    },
  })

  return consumer
}

const createMessageProducer = ({ kafka, indicateProduction }) => async ({ message }) => {
  const producer = kafka.producer()
  await producer.connect()
  const payload = {
    topic: env.kafka1confluentinc_topic,
    messages: [{ key: 'arbitrary', value: message }],
  }
  await producer.send(payload)
  await producer.disconnect()

  console.log('produced message with payload:', payload)
  indicateProduction(payload)
}

const setup = async ({ indicateConsumption, indicateProduction }) => {
  const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    clientId: env.kafka1confluentinc_client_id,
    brokers: [env.kafka1confluentinc_broker1],
    retry: {
      initialRetryTime: 1200,
      retries: 100,
    },
  })

  const consumer = await createConsumer({ kafka, indicateConsumption })
  const messageProducer = await createMessageProducer({ kafka, indicateProduction })

  return {
    kafka,
    consumer,
    messageProducer,
  }
}

const main = async ({ indicateConsumption, indicateProduction }) => {
  const { messageProducer } = await setup({ indicateConsumption, indicateProduction })

  await messageProducer({ message: 'imaginary message' })
}

export default main
