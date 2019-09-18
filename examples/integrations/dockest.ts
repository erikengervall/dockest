import dotenv from 'dotenv'
import Dockest, { logLevel, runners } from '../../src'

const env: any = dotenv.config().parsed
const { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } = runners

/**
 * When passing the `image` prop in the runner opts, the service name no longer has to match a Docker compose service
 */
const postgres1sequelizeRunner = new PostgresRunner({
  service: 'dockest_inline_service_name_postgres1sequelizeRunner',
  image: 'postgres:9.6',
  commands: [
    'sequelize db:migrate:undo:all',
    'sequelize db:migrate',
    'sequelize db:seed:undo:all',
    'sequelize db:seed --seed 20190101001337-demo-user',
  ],
  database: env.postgres1sequelize_database,
  password: env.postgres1sequelize_password,
  ports: {
    [env.postgres1sequelize_port]: PostgresRunner.DEFAULT_PORT,
  },
  username: env.postgres1sequelize_username,
})

const postgres2knexRunner = new PostgresRunner({
  service: env.postgres2knex_service,
  image: 'postgres:9.6',
  commands: [
    './node_modules/knex/bin/cli.js migrate:rollback',
    './node_modules/knex/bin/cli.js migrate:latest',
    './node_modules/knex/bin/cli.js seed:run',
  ],
  database: env.postgres2knex_database,
  host: PostgresRunner.DEFAULT_HOST,
  password: env.postgres2knex_password,
  ports: {
    [env.postgres2knex_port]: PostgresRunner.DEFAULT_PORT,
  },
  username: env.postgres2knex_username,
})

const redis1ioredisRunner = new RedisRunner({
  service: env.redis1ioredis_service,
  image: 'redis:5.0.3',
  ports: {
    [env.redis1ioredis_port]: RedisRunner.DEFAULT_PORT,
  },
})

const zookeeper1confluentincRunner = new ZooKeeperRunner({
  service: env.zookeeper1confluentinc_service,
  image: 'confluentinc/cp-zookeeper:5.2.2',
  ports: {
    [env.zookeeper1confluentinc_port]: ZooKeeperRunner.DEFAULT_PORT,
  },
})

const kafka1confluentincRunner = new KafkaRunner({
  service: env.kafka1confluentinc_service,
  image: 'confluentinc/cp-kafka:5.2.2',
  dependsOn: [zookeeper1confluentincRunner],
  ports: {
    [env.kafka1confluentinc_port1]: KafkaRunner.DEFAULT_PORT_PLAINTEXT,
    // [env.kafka1confluentinc_port2]: KafkaRunner.DEFAULT_PORT_SSL,
    // [env.kafka1confluentinc_port3]: KafkaRunner.DEFAULT_PORT_SASL_SSL,
  },
})

const dockest = new Dockest({
  runners: [
    ...(process.env.DOCKEST_CI === 'true' || env.postgres1sequelize_enabled === 'true'
      ? [postgres1sequelizeRunner]
      : []),
    ...(process.env.DOCKEST_CI === 'true' || env.postgres2knex_enabled === 'true' ? [postgres2knexRunner] : []),
    ...(process.env.DOCKEST_CI === 'true' || env.redis1ioredis_enabled === 'true' ? [redis1ioredisRunner] : []),
    ...(process.env.DOCKEST_CI === 'true' || env.kafka1confluentinc_enabled === 'true'
      ? [kafka1confluentincRunner]
      : []),
  ],
  jest: {
    verbose: true,
  },
  opts: {
    afterSetupSleep: 10,
    dev: {
      // debug: true,
    },
    dumpErrors: false,
    exitHandler: ({ trap }) => console.log(`Hello ${trap}, nice to meet you 👋🏼`), // eslint-disable-line no-console
    logLevel: logLevel.DEBUG,
    runInBand: true,
  },
})

dockest.run()
