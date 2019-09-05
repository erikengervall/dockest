// import * as jest from 'jest'
import {
  EXTERNAL_PORT as usersExternalPort,
  INTERNAL_PORT as usersInternalPort,
  SERVICE_NAME as usersServiceName,
  PATH as usersPath,
} from './users/constants'
// import {
//   EXTERNAL_PORT as yetAnotherMicroserviceExternalPort,
//   INTERNAL_PORT as yetAnotherMicroserviceInternalPort,
//   SERVICE_NAME as yetAnotherMicroserviceServiceName,
//   PATH as yetAnotherMicroservicePath,
// } from './yet-another-microservice/constants'
import Dockest, { logLevel, runners } from '../../src'

const { GeneralPurposeRunner } = runners

const usersRunner = new GeneralPurposeRunner({
  service: usersServiceName,
  ports: { [`${usersExternalPort}`]: `${usersInternalPort}` },
  props: {
    build: usersPath,
  },
})

// const yetAnotherMicroservice = new GeneralPurposeRunner({
//   service: yetAnotherMicroserviceServiceName,
//   ports: { [`${yetAnotherMicroserviceExternalPort}`]: `${yetAnotherMicroserviceInternalPort}` },
//   props: {
//     build: yetAnotherMicroservicePath,
//   },
// })

const dockest = new Dockest({
  jest: {
    lib: require('jest'),
  },
  opts: {
    logLevel: logLevel.DEBUG,
    dumpErrors: true,
  },
  runners: [usersRunner],
})

dockest.run()
