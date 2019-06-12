import KafkaRunner from './index'

const config = {
  service: '_',
  topics: ['_'],
  KAFKA_ZOOKEEPER_CONNECT: '_',
}
const KafkaRunner1 = new KafkaRunner(config)
const KafkaRunner2 = new KafkaRunner(config)

describe('KafkaRunner', () => {
  it('should create unique instances', () => {
    expect(KafkaRunner1).not.toBe(KafkaRunner2)
  })
})
