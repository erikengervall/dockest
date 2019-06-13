import ZooKeeperRunner from './index'

const config = {
  service: '_',
  host: '_',
}
const ZooKeeperRunner1 = new ZooKeeperRunner(config)
const ZooKeeperRunner2 = new ZooKeeperRunner(config)

describe('ZooKeeperRunner', () => {
  it('should create unique instances', () => {
    expect(ZooKeeperRunner1).not.toBe(ZooKeeperRunner2)
  })
})
