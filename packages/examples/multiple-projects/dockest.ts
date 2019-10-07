import Dockest, { logLevel, runners } from '../../lib/src'

const placeHolderRunner = new runners.GeneralPurposeRunner({
  service: 'never_gonna_give_you_up',
  image: 'redis:5.0.3',
  ports: [
    {
      published: 6381,
      target: 6379,
    },
  ],
})

const dockest = new Dockest({
  jest: {
    lib: require('jest'),
    projects: ['./projects'],
  },
  opts: {
    logLevel: logLevel.DEBUG,
  },
})

dockest.attachRunners([placeHolderRunner])

dockest.run()
