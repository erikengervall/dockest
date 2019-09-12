import getDependsOn from './getDependsOn'
import { RedisRunner } from '../index'

describe('getDependsOn', () => {
  it('should resolve service names from dependencies', () => {
    const depRunner1 = new RedisRunner({ service: 'redis1', image: 'some/image:123' })
    const depRunner2 = new RedisRunner({ service: 'redis2', image: 'some/image:123' })
    const depRunners = [depRunner1, depRunner2]

    const result = getDependsOn(depRunners)

    expect(result).toEqual({
      depends_on: ['redis1', 'redis2'], // eslint-disable-line @typescript-eslint/camelcase
    })
  })
})
