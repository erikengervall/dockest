import dotenv from 'dotenv'

/* tslint:disable */
const { Kafka, logLevel } = require('kafkajs')

type JestFn = (_: any) => void

const env: any = dotenv.config().parsed

const kafka = new Kafka({
  brokers: [env.kafka1confluentinc_broker1],
  clientId: env.kafka1confluentinc_client_id,
  logLevel: logLevel.INFO,
  retry: {
    initialRetryTime: 2500,
    retries: 10,
  },
})

const createConsumer = async (mockConsumptionCallback: JestFn) => {
  const consumer = kafka.consumer({ groupId: env.kafka1confluentinc_consumer_group_id })
  await consumer.connect()
  await consumer.subscribe({ topic: env.kafka1confluentinc_topic })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      mockConsumptionCallback({
        messageHeaders: message.headers,
        messageKey: message.key.toString(),
        messageValue: message.value.toString(),
        partition,
        topic,
      })
    },
  })

  return consumer
}

const produceMessage = async (key: string, messages: string[], mockProductionCallback: JestFn) => {
  const producer = kafka.producer()
  await producer.connect()
  const payload = {
    acks: process.env.NODE_ENV === 'test' ? 1 : -1, // https://kafka.js.org/docs/producing#options
    topic: env.kafka1confluentinc_topic,
    messages: messages.map((message: string) => ({ key, value: message })),
  }
  await producer.send(payload)
  await producer.disconnect()
  mockProductionCallback(payload)
}

const main = async (
  key: string,
  messages: string[],
  mockConsumptionCallback: JestFn,
  mockProductionCallback: JestFn
): Promise<{ consumer: any; produce: any }> => {
  const consumer = await createConsumer(mockConsumptionCallback)
  const produce = async () => await produceMessage(key, messages, mockProductionCallback)

  return {
    consumer,
    produce,
  }
}

export default main
