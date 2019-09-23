import { SERVICE_NAME as USERS_SERVICE_NAME } from './users/constants'
import { SERVICE_NAME as ORDERS_SERVICE_NAME } from './orders/constants'
import Dockest, { logLevel, runners } from '../../src'

const dockest = new Dockest({
  opts: {
    afterSetupSleep: 1,
    dumpErrors: true,
    logLevel: logLevel.DEBUG,
  },
})

dockest.attachRunners([
  new runners.GeneralPurposeRunner({
    service: USERS_SERVICE_NAME,
    ports: [
      {
        published: 1337,
        target: 1337,
      },
    ],
    build: './users',
    networks: ['bueno'],
  }),
  new runners.GeneralPurposeRunner({
    service: ORDERS_SERVICE_NAME,
    ports: [
      {
        published: 1338,
        target: 1338,
      },
    ],
    build: './orders',
    networks: ['bueno'],
  }),
])

dockest.run()
