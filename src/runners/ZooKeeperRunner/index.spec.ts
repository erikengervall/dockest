/* eslint-disable @typescript-eslint/ban-ts-ignore */

import ZooKeeperRunner from './index'

const ZooKeeperRunner1 = new ZooKeeperRunner({ service: 'zk1', image: 'some/image:123' })
const ZooKeeperRunner2 = new ZooKeeperRunner({ service: 'zk2', image: 'some/image:123' })

describe('ZooKeeperRunner', () => {
  it('should create unique instances', () => {
    expect(ZooKeeperRunner1).not.toBe(ZooKeeperRunner2)
  })

  it('should fail validation', () => {
    // @ts-ignore
    expect(() => new ZooKeeperRunner({})).toThrow(/service: Schema-key missing in config/)
  })
})
