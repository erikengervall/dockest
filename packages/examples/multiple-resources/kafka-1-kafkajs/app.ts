const { Kafka, logLevel } = require('kafkajs') // eslint-disable-line @typescript-eslint/no-var-requires

type JestFn = (_: any) => void

const kafka = new Kafka({
  brokers: ['localhost:9092'],
  clientId: 'dockest_example',
  logLevel: logLevel.NOTHING,
  retry: {
    initialRetryTime: 2500,
    retries: 10,
  },
})

const createConsumer = (
  mockConsumptionCallback: JestFn,
): { consumer: any; startConsuming: () => Promise<void>; stopConsuming: () => Promise<void> } => {
  const consumer = kafka.consumer({ groupId: 'dockest_group_1' })

  const startConsuming = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'dockesttopic' })
    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: {
        topic: string
        partition: number
        message: { headers: any; key: any; value: any }
      }) => {
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

  const stopConsuming = () => consumer.stop()

  return {
    consumer,
    startConsuming,
    stopConsuming,
  }
}

const produceMessage = (
  key: string,
  messages: string[],
  mockProductionCallback: JestFn,
): { emit: () => Promise<void> } => {
  const producer = kafka.producer()
  const payload = {
    acks: process.env.NODE_ENV === 'test' ? 1 : -1, // https://kafka.js.org/docs/producing#options
    topic: 'dockesttopic',
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

export const app = (
  key: string,
  messages: string[],
  mockConsumptionCallback: JestFn,
  mockProductionCallback: JestFn,
) => ({
  ...createConsumer(mockConsumptionCallback),
  ...produceMessage(key, messages, mockProductionCallback),
})
