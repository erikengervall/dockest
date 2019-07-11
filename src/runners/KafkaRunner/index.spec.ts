import ZooKeeperRunner from '../ZooKeeperRunner'
import KafkaRunner from './index'

const KafkaRunner1 = new KafkaRunner({
  dependsOn: [new ZooKeeperRunner({ service: 'zk1' })],
  service: 'k1',
})
const KafkaRunner2 = new KafkaRunner({
  dependsOn: [new ZooKeeperRunner({ service: 'zk2' })],
  service: 'k2',
})

describe('KafkaRunner', () => {
  it('should create unique instances', () => {
    expect(KafkaRunner1).not.toBe(KafkaRunner2)
  })

  it('should fail validation', () => {
    expect(
      () =>
        // @ts-ignore
        new KafkaRunner({})
    ).toThrow(/service: Schema-key missing in config/)
  })
})
