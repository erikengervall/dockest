import Dockest, { logLevel } from '../../lib/src'

const dockest = new Dockest({
  jest: {
    verbose: true,
  },
  opts: {
    afterSetupSleep: 2,
    dumpErrors: true,
    logLevel: logLevel.DEBUG,
    guessRunnerType: true,
    composeFile: ['docker-compose-redis.yml', 'docker-compose-postgres.yml'],
  },
})

dockest.run()
