import dotenv from 'dotenv'
import Redis from 'ioredis'
// @ts-ignore
import { seedCake } from './data.json'

const env: any = dotenv.config().parsed
const redis = new Redis({
  host: env.redis1ioredis_host,
  port: Number(env.redis1ioredis_port),
  password: env.redis1ioredis_password,
})

const app = () => {
  redis.set(seedCake.key, seedCake.value)

  return {
    redis,
  }
}

export default app
