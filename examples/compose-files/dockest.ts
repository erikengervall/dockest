import Dockest, { logLevel, runners } from '../../src'
import { RedisRunner } from '../../src/runners'

const dockest = new Dockest({
  jest: {
    verbose: true,
  },
  opts: {
    afterSetupSleep: 0,
    dev: {
      debug: true,
    },
    dumpErrors: true,
    logLevel: logLevel.DEBUG,
    composeFile: ['docker-compose-redis.yml', 'docker-compose-postgres.yml'],
  },
})

dockest.attachRunners([
  new runners.RedisRunner({
    service: 'attachedRedisRunner',
    image: 'redis:5.0.3',
    ports: { '1337': RedisRunner.DEFAULT_PORT },
  }),
])

dockest.run()
