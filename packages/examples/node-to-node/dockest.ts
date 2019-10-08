import Dockest, { logLevel, runners } from '../../lib/src'

const dockest = new Dockest({
  opts: {
    afterSetupSleep: 1,
    dumpErrors: true,
    logLevel: logLevel.DEBUG,
  },
})

dockest.attachRunners([
  new runners.GeneralPurposeRunner({
    service: 'users',
    ports: [
      {
        published: 1337,
        target: 1337,
      },
    ],
    build: './users',
    networks: ['bueno'],
    connectionTimeout: 15,
  }),
  new runners.GeneralPurposeRunner({
    service: 'orders',
    ports: [
      {
        published: 1338,
        target: 1338,
      },
    ],
    build: './orders',
    networks: ['bueno'],
    connectionTimeout: 15,
  }),
])

dockest.run()
