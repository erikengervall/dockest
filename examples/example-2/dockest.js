const {
  default: Dockest,
  logLevel,
  runners: { RedisRunner },
} = require('../../dist') // eslint-disable-line @typescript-eslint/no-var-requires

/**
 * Placeholder runner in order for Dockest to not throw configuration errors due to lack of runners
 */
const placeHolderRunner = new RedisRunner({
  service: 'never_gonna_give_you_up',
  image: 'redis:5.0.3',
  ports: { [RedisRunner.DEFAULT_PORT]: RedisRunner.DEFAULT_PORT },
})

const dockest = new Dockest({
  runners: [placeHolderRunner],
  jest: {
    lib: require('jest'),
    projects: ['./projects'],
    verbose: true,
  },
  opts: {
    logLevel: logLevel.DEBUG,
    dev: {
      // debug: true,
    },
  },
})

dockest.run()
