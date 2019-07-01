import dotenv from 'dotenv'
// tslint:disable-next-line
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

const createConsumer = (
  mockConsumptionCallback: JestFn
): { consumer: any; startConsuming: () => Promise<void> } => {
  const consumer = kafka.consumer({ groupId: env.kafka1confluentinc_consumer_group_id })

  const startConsuming = async () => {
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
  }

  return {
    consumer,
    startConsuming,
  }
}

const produceMessage = (
  key: string,
  messages: string[],
  mockProductionCallback: JestFn
): { emit: () => Promise<void> } => {
  const producer = kafka.producer()
  const payload = {
    acks: process.env.NODE_ENV === 'test' ? 1 : -1, // https://kafka.js.org/docs/producing#options
    topic: env.kafka1confluentinc_topic,
    messages: messages.map((message: string) => ({ key, value: message })),
  }

  const emit = async () => {
    await producer.connect()
    await producer.send(payload)
    await producer.disconnect()
    mockProductionCallback(payload)
  }

  return {
    emit,
  }
}

const app = (
  key: string,
  messages: string[],
  mockConsumptionCallback: JestFn,
  mockProductionCallback: JestFn
) => ({
  ...createConsumer(mockConsumptionCallback),
  ...produceMessage(key, messages, mockProductionCallback),
})

export default app
