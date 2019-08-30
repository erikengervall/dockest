import ZooKeeperRunner from './index'

const ZooKeeperRunner1 = new ZooKeeperRunner({ service: 'zk1' })
const ZooKeeperRunner2 = new ZooKeeperRunner({ service: 'zk2' })

describe('ZooKeeperRunner', () => {
  it('should create unique instances', () => {
    expect(ZooKeeperRunner1).not.toBe(ZooKeeperRunner2)
  })

  it('should fail validation', () => {
    expect(
      () =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        new ZooKeeperRunner({}),
    ).toThrow(/service: Schema-key missing in config/)
  })
})
