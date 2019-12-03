import Redis from 'ioredis'

const seedCake = {
  key: 'thecakeistein',
  value: 'lie',
}

const redis = new Redis({
  host: 'localhost',
  port: 6380,
})

const app = () => {
  redis.set(seedCake.key, seedCake.value)

  return {
    redis,
  }
}

export default app
