const dotenv = require('dotenv')
const { Kafka } = require('kafkajs')

const env = dotenv.config().parsed

const createKafka = () => {
  const kafka = new Kafka({
    brokers: [env.KAFKA_HOST],
    // ssl: any,
    // sasl: any,
    // clientId: any,
    // connectionTimeout: any,
    // authenticationTimeout: any,
    // retry: any,
    // logLevel: number,
    // logCreator: any,
    // allowExperimentalV011: boolean,
  })

  // const producer = kafka.producer() // or with options kafka.producer({ metadataMaxAge: 300000 })

  // const a = async () => {
  //   await producer.connect()
  //   await producer.send({
  //     topic: 'topic-name',
  //     messages: [{ key: 'key1', value: 'hello world' }, { key: 'arbitrary', value: 'Hola!' }],
  //   })

  //   // before you exit your app
  //   await producer.disconnect()
  // }

  return kafka
}

module.exports = createKafka
