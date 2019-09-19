const {
  default: Dockest,
  logLevel,
  runners: { GeneralPurposeRunner },
} = require('../../dist') // eslint-disable-line @typescript-eslint/no-var-requires

const placeHolderRunner = new GeneralPurposeRunner({
  service: 'never_gonna_give_you_up',
  image: 'redis:5.0.3',
  ports: { '1337': '1337' },
})

const dockest = new Dockest({
  jest: {
    lib: require('jest'),
    projects: ['./projects'],
  },
  opts: {
    logLevel: logLevel.DEBUG,
    dev: {
      // debug: true,
    },
  },
})

dockest.attachRunners([placeHolderRunner])

dockest.run()
