import KafkaRunner from './index'
import ZooKeeperRunner from '../ZooKeeperRunner'

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        new KafkaRunner({}),
    ).toThrow(/service: Schema-key missing in config/)
  })
})
