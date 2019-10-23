import dotenv from 'dotenv'
import Redis from 'ioredis'

const { seedCake } = require('./data.json') // eslint-disable-line @typescript-eslint/no-var-requires

const env: any = dotenv.config().parsed
const redis = new Redis({
  host: env.redis1ioredis_host,
  port: Number(env.redis1ioredis_port),
})

const app = () => {
  redis.set(seedCake.key, seedCake.value)

  return {
    redis,
  }
}

export default app
