import dotenv from 'dotenv'

// @ts-ignore
import Dockest, { logLevel, runners } from '../src'

const env: any = dotenv.config().parsed
const { KafkaRunner, PostgresRunner, RedisRunner } = runners

const postgres1sequelize = new PostgresRunner({
  username: env.postgres1sequelize_username,
  password: env.postgres1sequelize_password,
  database: env.postgres1sequelize_database,
  host: env.postgres1sequelize_host,
  port: Number(env.postgres1sequelize_port),
  service: env.postgres1sequelize_service,
  commands: [
    'sequelize db:migrate:undo:all',
    'sequelize db:migrate',
    'sequelize db:seed:undo:all',
    'sequelize db:seed --seed 20190101001337-demo-user',
  ],
})

const postgres2knex = new PostgresRunner({
  username: env.postgres2knex_username,
  password: env.postgres2knex_password,
  database: env.postgres2knex_database,
  host: env.postgres2knex_host,
  port: Number(env.postgres2knex_port),
  service: env.postgres2knex_service,
  commands: [
    './node_modules/knex/bin/cli.js migrate:rollback',
    './node_modules/knex/bin/cli.js migrate:latest',
    './node_modules/knex/bin/cli.js seed:run',
  ],
})

const redis1ioredis = new RedisRunner({
  service: env.redis1ioredis_service,
  host: env.redis1ioredis_host,
  port: Number(env.redis1ioredis_port),
  password: env.redis1ioredis_password,
})

const kafka1kafkajs = new KafkaRunner({
  service: env.kafka1confluentinc_service,
  host: env.kafka_host,
  topics: [env.kafka_topic],
  autoCreateTopics: true,
  ports: {
    [env.kafka_port1]: env.kafka_port1,
    [env.kafka_port2]: env.kafka_port2,
    [env.kafka_port3]: env.kafka_port3,
  },
})

const dockest = new Dockest({
  logLevel: logLevel.VERBOSE,
  afterSetupSleep: 5,
  jest: {
    // tslint:disable-next-line
    lib: require('jest'),
    verbose: true,
  },
  runners: {
    ...(env.postgres1sequelize_enabled === 'true' || env.CI === 'true'
      ? { postgres1sequelize }
      : {}),
    ...(env.postgres2knex_enabled === 'true' || env.CI === 'true' ? { postgres2knex } : {}),
    ...(env.kafka_enabled === 'true' ? { kafka1kafkajs } : {}),
    ...(env.redis1ioredis_enabled === 'true' ? { redis1ioredis } : {}),
  },
})

dockest.run()
