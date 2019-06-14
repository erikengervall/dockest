import dotenv from 'dotenv'

/* tslint:disable */
// @ts-ignore
const { Kafka } = require('kafkajs')

const env: any = dotenv.config().parsed

const createConsumer = async ({ kafka, indicateConsumption }) => {
  const consumer = kafka.consumer({ groupId: env.kafka_consumer_group_id })

  await consumer.connect()
  await consumer.subscribe({ topic: env.kafka_topic })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('eachMessage ran', {
        topic,
        partition,
        messageKey: message.key.toString(),
        messageValue: message.value.toString(),
        messageHeaders: message.headers,
      })

      indicateConsumption({
        indicateConsumption: true,
        topic,
        partition,
        messageKey: message.key.toString(),
        messageValue: message.value.toString(),
        messageHeaders: message.headers,
      })
    },
  })

  return consumer
}

const createMessageProducer = ({ kafka, indicateProduction }) => async ({ message }) => {
  const producer = kafka.producer()
  await producer.connect()
  await producer.send({
    topic: env.kafka_topic,
    messages: [{ key: 'arbitrary', value: message }],
  })
  await producer.disconnect()

  indicateProduction({
    indicateProduction: true,
    topic: env.kafka_topic,
    messages: [{ key: 'arbitrary', value: message }],
  })
}

const setup = async ({ indicateConsumption, indicateProduction }) => {
  const kafka = new Kafka({
    clientId: env.kafka_client_id,
    brokers: [env.kafka_broker1],
    retry: {
      initialRetryTime: 1000,
      retries: 10,
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
