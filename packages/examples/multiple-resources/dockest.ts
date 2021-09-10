import { Dockest, logLevel, sleepWithLog } from 'dockest'
import { createPostgresReadinessCheck, createRedisReadinessCheck } from 'dockest/readiness-check'

const { run } = new Dockest({
  composeFile: 'docker-compose.yml',
  dumpErrors: true,
  exitHandler: errorPayload =>
    // eslint-disable-next-line no-console
    console.log(`\nHello <<${JSON.stringify(errorPayload, null, 2)}>>, nice to meet you 👋🏼\n`),
  jestLib: require('jest'),
  jestOpts: {
    updateSnapshot: true,
  },
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
    readinessCheck: createPostgresReadinessCheck(),
  },

  {
    serviceName: 'multiple_resources_postgres2knex',
    commands: ['knex migrate:rollback', 'knex migrate:latest', 'knex seed:run'],
    readinessCheck: createPostgresReadinessCheck(),
  },

  {
    serviceName: 'multiple_resources_redis',
    readinessCheck: createRedisReadinessCheck(),
  },

  {
    // https://github.com/wurstmeister/kafka-docker/issues/167
    serviceName: 'multiple_resources_kafka',
    dependsOn: [
      {
        serviceName: 'multiple_resources_zookeeper',
      },
    ],
    readinessCheck: () => sleepWithLog(10, `Sleeping a bit for Kafka's sake`),
  },
])
