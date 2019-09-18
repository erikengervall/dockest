import { SERVICE_NAME as USERS_SERVICE_NAME } from './users/constants'
import { SERVICE_NAME as ORDERS_SERVICE_NAME } from './orders/constants'
import Dockest, { logLevel, runners } from '../../src'

const dockest = new Dockest({
  jest: {
    lib: require('jest'),
  },
  opts: {
    logLevel: logLevel.DEBUG,
    dumpErrors: true,
    afterSetupSleep: 1,
  },
  runners: [
    new runners.GeneralPurposeRunner({
      service: USERS_SERVICE_NAME,
      ports: { '1337': '1337' },
      build: './users',
      networks: ['bueno'],
    }),
    new runners.GeneralPurposeRunner({
      service: ORDERS_SERVICE_NAME,
      ports: { '1338': '1338' },
      build: './orders',
      networks: ['bueno'],
    }),
  ],
})

dockest.run()
