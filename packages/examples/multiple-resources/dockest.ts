import { Dockest, logLevel } from 'dockest'

const { run } = new Dockest({
  composeFile: 'docker-compose.yml',
  dumpErrors: true,
  exitHandler: errorPayload =>
    // eslint-disable-next-line no-console
    console.log(`\nHello <<${JSON.stringify(errorPayload, null, 2)}>>, nice to meet you 👋🏼\n`),
  jestLib: require('jest'),
  jestOpts: { updateSnapshot: true },
  logLevel: logLevel.DEBUG,
})

run([
  {
    serviceName: 'multiple_resources_postgres1sequelize',
    commands: [
      'sequelize db:migrate:undo:all',
      'sequelize db:migrate',
      'sequelize db:seed:undo:all',
      'sequelize db:seed --seed 20190101001337-demo-user',
      containerId => `echo "The container id is ${containerId}"`,
    ],
    readinessCheck: async ({
      defaultReadinessChecks: { postgres },
      dockerComposeFileService: {
        environment: { POSTGRES_DB, POSTGRES_USER },
      },
    }) => postgres({ POSTGRES_DB, POSTGRES_USER }),
  },

  {
    serviceName: 'multiple_resources_postgres2knex',
    commands: ['knex migrate:rollback', 'knex migrate:latest', 'knex seed:run'],
    readinessCheck: async ({
      defaultReadinessChecks: { postgres },
      dockerComposeFileService: {
        environment: { POSTGRES_DB, POSTGRES_USER },
      },
    }) => postgres({ POSTGRES_DB, POSTGRES_USER }),
  },

  {
    serviceName: 'multiple_resources_redis',
    readinessCheck: ({ defaultReadinessChecks: { redis } }) => redis(),
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
