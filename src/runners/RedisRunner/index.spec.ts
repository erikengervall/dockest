/* eslint-disable @typescript-eslint/ban-ts-ignore */

import RedisRunner from './index'

const RedisRunner1 = new RedisRunner({ service: 'r1', image: 'some/image:123' })
const RedisRunner2 = new RedisRunner({ service: 'r2', image: 'some/image:123' })

describe('RedisRunner', () => {
  it('should create unique instances', () => {
    expect(RedisRunner1).not.toBe(RedisRunner2)
    expect(RedisRunner1).toMatchSnapshot()
    expect(RedisRunner2).toMatchSnapshot()
  })

  it('should fail validation', () => {
    // @ts-ignore
    expect(() => new RedisRunner({})).toThrow(/service: Schema-key missing in config/)
  })
})
