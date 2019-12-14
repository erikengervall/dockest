import { Dockest, logLevel, defaultHealthchecks } from 'dockest'

const dockest = new Dockest({
  composeFile: ['docker-compose-redis.yml', 'docker-compose-postgres.yml'],
  dumpErrors: true,
  logLevel: logLevel.INFO,
  runInBand: true,
})

dockest.run([
  {
    serviceName: 'composePostgres',
    commands: [
      'sequelize db:migrate:undo:all',
      'sequelize db:migrate',
      'sequelize db:seed:undo:all',
      'sequelize db:seed --seed 20190101001337-demo-user',
    ],
    healthchecks: [defaultHealthchecks.postgres],
  },

  {
    serviceName: 'composeRedis',
    commands: [],
    healthchecks: [],
  },
])
