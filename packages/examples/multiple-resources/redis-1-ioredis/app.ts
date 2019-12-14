import Redis from 'ioredis'

const { seedCake } = require('./data.json') // eslint-disable-line @typescript-eslint/no-var-requires

const redis = new Redis({
  host: 'localhost',
  port: 6381,
})

export const app = () => {
  redis.set(seedCake.key, seedCake.value)

  return {
    redis,
  }
}
