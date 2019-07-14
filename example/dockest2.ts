// tslint:disable:no-console

import dotenv from 'dotenv'
import Dockest, { runners } from '../src'

const env: any = dotenv.config().parsed
const { RedisRunner } = runners

/**
 * When supplying an image, the service name does not have to correspond what's in your Compose file
 */
const redis1ioredisRunner = new RedisRunner({
  service: 'dockest_redis_inline',
  image: 'redis:5.0.3',
  password: env.redis1ioredis_password,
  ports: {
    [env.redis1ioredis_port]: RedisRunner.DEFAULT_PORT,
  },
})

const dockest = new Dockest({
  runners: [...(env.CI === 'true' || env.redis1ioredis_enabled === 'true' ? [redis1ioredisRunner] : [])],
})

dockest.run()
