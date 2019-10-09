/* eslint-disable @typescript-eslint/ban-ts-ignore */

import KafkaRunner from './index'
import ZooKeeperRunner from '../ZooKeeperRunner'

const kafkaRunner1 = new KafkaRunner({
  dependsOn: [
    new ZooKeeperRunner({
      service: 'zk1',
      image: 'some/image:123',
    }),
  ],
  service: 'k1',
  image: 'some/image:123',
})
const kafkaRunner2 = new KafkaRunner({
  dependsOn: [
    new ZooKeeperRunner({
      service: 'zk2',
      image: 'some/image:123',
    }),
  ],
  service: 'k2',
  image: 'some/image:123',
})

describe('KafkaRunner', () => {
  it('should create unique instances', () => {
    expect(kafkaRunner1).not.toBe(kafkaRunner2)
    expect(kafkaRunner1).toMatchSnapshot()
    expect(kafkaRunner2).toMatchSnapshot()
  })

  it('should fail validation', () => {
    // @ts-ignore
    expect(() => new KafkaRunner({}).validateConfig()).toThrow(/service: Schema-key missing in config/)
  })
})
