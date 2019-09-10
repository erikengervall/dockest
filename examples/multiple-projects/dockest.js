const {
  default: Dockest,
  logLevel,
  runners: { GeneralPurposeRunner },
} = require('../../dist') // eslint-disable-line @typescript-eslint/no-var-requires

/**
 * Placeholder runner in order for Dockest to not throw configuration errors due to lack of runners
 */
const placeHolderRunner = new GeneralPurposeRunner({
  service: 'never_gonna_give_you_up',
  image: 'redis:5.0.3',
  ports: { '1337': '1337' },
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
