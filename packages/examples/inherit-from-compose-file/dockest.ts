import Dockest, { runners, logLevel } from '../../lib/src'

const dockest = new Dockest({
  jest: {
    verbose: true,
  },
  opts: {
    dumpErrors: true,
    logLevel: logLevel.DEBUG,
    composeFile: ['docker-compose.yml'],
  },
})

dockest.attachRunners([
  new runners.PostgresRunner({
    service: 'postgres-service',
    database: 'postgres',
    password: 'postgres',
    username: 'postgres',
  }),
])

dockest.run()
