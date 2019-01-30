import dotenv from 'dotenv'

/* tslint:disable */
// @ts-ignore
const { Kafka } = require('kafkajs')

const env: any = dotenv.config().parsed

const setup = async () => {
  const kafka = new Kafka({
    clientId: 'dockest/example',
    brokers: [env.kafka_host],
    retry: {
      initialRetryTime: 137,
      retries: 3,
    },
  })

  const setupConsumer = async () => {
    const consumer = kafka.consumer({ groupId: 'groupdId:1  ' })

    await consumer.connect()
    await consumer.subscribe({ topic: env.kafka_topic })
    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: {
        topic: any
        partition: any
        message: any
      }) => {
        console.log({
          topic,
          partition,
          messageKey: message.key.toString(),
          messageValue: message.value.toString(),
          messageHeaders: message.headers,
        })
      },
    })
  }
  setupConsumer()

  const produceMessage = async (message: any) => {
    const producer = kafka.producer()
    await producer.connect()
    await producer.send({
      topic: env.kafka_topic,
      messages: [{ key: 'arbitrary', value: message }],
    })
    await producer.disconnect()
  }

  return produceMessage
}

const main = async () => {
  await setup()

  // setTimeout(async () => {
  //   await produceMessage('arbitrary message')
  // }, 1000)
}

main()

export default main
