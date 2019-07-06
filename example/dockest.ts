// tslint:disable:no-console

import dotenv from 'dotenv'
import Dockest, { logLevel, runners } from '../src'

const env: any = dotenv.config().parsed
const { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } = runners

const postgres1sequelizeRunner = new PostgresRunner({
  service: env.postgres1sequelize_service,
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
  password: env.redis1ioredis_password,
  ports: {
    [env.redis1ioredis_port]: RedisRunner.DEFAULT_PORT,
  },
})

const zookeeper1confluentincRunner = new ZooKeeperRunner({
  service: env.zookeeper1confluentinc_service,
  ports: {
    [env.zookeeper1confluentinc_port]: ZooKeeperRunner.DEFAULT_PORT,
  },
})

const kafka1confluentincRunner = new KafkaRunner({
  service: env.kafka1confluentinc_service,
  dependsOn: [zookeeper1confluentincRunner],
  ports: {
    [env.kafka1confluentinc_port1]: KafkaRunner.DEFAULT_PORT_PLAINTEXT,
    // [env.kafka1confluentinc_port2]: KafkaRunner.DEFAULT_PORT_SSL,
    // [env.kafka1confluentinc_port3]: KafkaRunner.DEFAULT_PORT_SASL_SSL,
  },
})

const dockest = new Dockest({
  runners: [
    ...(env.CI === 'true' || env.postgres1sequelize_enabled === 'true'
      ? [postgres1sequelizeRunner]
      : []),
    ...(env.CI === 'true' || env.postgres2knex_enabled === 'true' ? [postgres2knexRunner] : []),
    ...(env.CI === 'true' || env.redis1ioredis_enabled === 'true' ? [redis1ioredisRunner] : []),
    ...(env.CI === 'true' || env.kafka1confluentinc_enabled === 'true'
      ? [kafka1confluentincRunner]
      : []),
  ],
  jest: {
    verbose: true,
  },
  opts: {
    afterSetupSleep: 11,
    composeFileName: 'docker-compose.yml',
    dev: {
      // debug: true,
    },
    exitHandler: ({ trap }) => console.log(`👋🏼 Hello custom exit handler (${trap})`),
    logLevel: logLevel.VERBOSE,
    runInBand: true,
  },
})

dockest.run()
