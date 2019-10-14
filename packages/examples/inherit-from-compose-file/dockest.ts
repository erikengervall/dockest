import Dockest, { runners, logLevel } from 'dockest'

const dockest = new Dockest({
  opts: {
    dumpErrors: true,
    logLevel: logLevel.DEBUG,
    composeFile: 'docker-compose.yml',
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
