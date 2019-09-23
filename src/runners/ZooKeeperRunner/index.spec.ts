/* eslint-disable @typescript-eslint/ban-ts-ignore */

import ZooKeeperRunner from './index'

const ZooKeeperRunner1 = new ZooKeeperRunner({ service: 'zk1', image: 'some/image:123' })
const ZooKeeperRunner2 = new ZooKeeperRunner({ service: 'zk2', image: 'some/image:123' })

describe('ZooKeeperRunner', () => {
  it('should create unique instances', () => {
    expect(ZooKeeperRunner1).not.toBe(ZooKeeperRunner2)
    expect(ZooKeeperRunner1).toMatchSnapshot()
    expect(ZooKeeperRunner2).toMatchSnapshot()
  })

  it('should fail validation', () => {
    // @ts-ignore
    expect(() => new ZooKeeperRunner({}).validateConfig()).toThrow(/service: Schema-key missing in config/)
  })
})
