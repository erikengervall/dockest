import Dockest, { logLevel } from '../../src'

const dockest = new Dockest({
  jest: {
    verbose: true,
  },
  opts: {
    afterSetupSleep: 2,
    dumpErrors: true,
    logLevel: logLevel.DEBUG,
    composeFile: ['docker-compose-redis.yml', 'docker-compose-postgres.yml'],
  },
})

dockest.run()
