import Dockest, { logLevel, runners } from '../../src'

const { RedisRunner } = runners

/**
 * Placeholder in order for Dockest to not throw configuration errors due to lack of runners
 */
const redis1ioredisRunner = new RedisRunner({
  service: 'never_gonna_give_you_up',
  image: 'redis:5.0.3',
  ports: { [RedisRunner.DEFAULT_PORT]: RedisRunner.DEFAULT_PORT },
})

const dockest = new Dockest({
  runners: [redis1ioredisRunner],
  jest: {
    verbose: true,
    projects: ['.'],
  },
  opts: {
    dev: {
      // debug: true,
    },
    logLevel: logLevel.DEBUG,
  },
})

dockest.run()