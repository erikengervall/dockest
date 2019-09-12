/* eslint-disable @typescript-eslint/ban-ts-ignore */

import KafkaRunner from './index'
import ZooKeeperRunner from '../ZooKeeperRunner'

const KafkaRunner1 = new KafkaRunner({
  dependsOn: [
    new ZooKeeperRunner({
      service: 'zk1',
      image: 'some/image:123',
    }),
  ],
  service: 'k1',
  image: 'some/image:123',
})
const KafkaRunner2 = new KafkaRunner({
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
    expect(KafkaRunner1).not.toBe(KafkaRunner2)
  })

  it('should fail validation', () => {
    // @ts-ignore
    expect(() => new KafkaRunner({})).toThrow(/service: Schema-key missing in config/)
  })
})
