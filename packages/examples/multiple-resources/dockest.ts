import jest from 'jest'
import { Dockest, logLevel, defaultHealthchecks } from 'dockest'

const dockest = new Dockest({
  composeFile: 'docker-compose.yml',
  dumpErrors: true,
  exitHandler: ({ trap }) => console.log(`Hello ${trap}, nice to meet you 👋🏼`), // eslint-disable-line no-console
  jestLib: jest,
  jestOpts: { updateSnapshot: true },
  logLevel: logLevel.DEBUG,
  runInBand: true,
})

dockest.run([
  {
    serviceName: 'dockest_postgres1sequelize',
    commands: [
      'sequelize db:migrate:undo:all',
      'sequelize db:migrate',
      'sequelize db:seed:undo:all',
      'sequelize db:seed --seed 20190101001337-demo-user',
    ],
    healthchecks: [defaultHealthchecks.postgres],
  },

  {
    serviceName: 'dockest_postgres2knex',
    commands: ['knex migrate:rollback', 'knex migrate:latest', 'knex seed:run'],
    healthchecks: [defaultHealthchecks.postgres],
  },

  {
    serviceName: 'dockest_redis1ioredis',
    commands: [],
    healthchecks: [defaultHealthchecks.redis],
  },

  {
    serviceName: 'dockest_zookeeper1confluentinc',
    commands: [],
    healthchecks: [],
  },

  {
    serviceName: 'dockest_kafka1confluentinc',
    commands: [],
    healthchecks: [],
  },
])
