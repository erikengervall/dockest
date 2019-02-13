import ZookeeperRunner from './index'

const config = {
  service: '_',
}
const ZookeeperRunner1 = new ZookeeperRunner(config)
const ZookeeperRunner2 = new ZookeeperRunner(config)

describe('ZookeeperRunner', () => {
  it('should create unique instances', () => {
    expect(ZookeeperRunner1).not.toBe(ZookeeperRunner2)
  })
})
