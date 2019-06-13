import RedisRunner from './index'

const config = {
  service: '_',
  image: '_',
}
const RedisRunner1 = new RedisRunner(config)
const RedisRunner2 = new RedisRunner(config)

describe('RedisRunner', () => {
  it('should create unique instances', () => {
    expect(RedisRunner1).not.toBe(RedisRunner2)
  })
})
