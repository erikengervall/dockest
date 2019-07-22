import RedisRunner from './index'

const RedisRunner1 = new RedisRunner({ service: 'r1' })
const RedisRunner2 = new RedisRunner({ service: 'r2' })

describe('RedisRunner', () => {
  it('should create unique instances', () => {
    expect(RedisRunner1).not.toBe(RedisRunner2)
  })

  it('should fail validation', () => {
    expect(
      () =>
        // @ts-ignore
        new RedisRunner({}),
    ).toThrow(/service: Schema-key missing in config/)
  })
})
