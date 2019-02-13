import KafkaExec from './KafkaRunner/execs'
import PostgresExec from './PostgresRunner/execs'
import RedisExec from './RedisRunner/execs'
import ZookeeperExec from './ZookeeperRunner/execs'

const execs: { [key: string]: any } = {
  KafkaExec,
  PostgresExec,
  RedisExec,
  ZookeeperExec,
}

describe('Execs', () => {
  Object.keys(execs).forEach(key => {
    it(`${key} should be a singleton`, () => {
      const exec1 = new execs[key]()
      const exec2 = new execs[key]()

      expect(exec1).toBe(exec2)
    })
  })
})
