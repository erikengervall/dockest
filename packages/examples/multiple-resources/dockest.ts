import jest from 'jest'
import { Dockest, logLevel } from 'dockest'

const dockest = new Dockest({
  composeFile: 'docker-compose.yml',
  dumpErrors: true,
  exitHandler: errorPayload =>
    console.log(`\nHello <<${JSON.stringify(errorPayload, null, 2)}>>, nice to meet you 👋🏼\n`),
  jestLib: jest,
  jestOpts: { updateSnapshot: true },
  logLevel: logLevel.DEBUG,
})

dockest.run([
  {
    serviceName: 'multiple_resources_postgres1sequelize',
    commands: [
      'sequelize db:migrate:undo:all',
      'sequelize db:migrate',
      'sequelize db:seed:undo:all',
      'sequelize db:seed --seed 20190101001337-demo-user',
    ],
    healthcheck: ({ defaultHealthchecks: { postgres } }) => postgres(),
  },

  {
    serviceName: 'multiple_resources_postgres2knex',
    commands: ['knex migrate:rollback', 'knex migrate:latest', 'knex seed:run'],
    healthcheck: ({ defaultHealthchecks: { postgres } }) => postgres(),
  },

  {
    serviceName: 'multiple_resources_redis',
    healthcheck: ({ defaultHealthchecks: { redis } }) => redis(),
  },

  {
    serviceName: 'multiple_resources_zookeeper',
    dependents: [
      {
        serviceName: 'multiple_resources_kafka',
      },
    ],
  },
])
