import dotenv from 'dotenv'

// @ts-ignore
import Dockest, { logLevel, runners } from '../src'

const env: any = dotenv.config().parsed
const { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } = runners

const postgres1sequelizeRunner = new PostgresRunner({
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

const postgres2knexRunner = new PostgresRunner({
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

const redis1ioredisRunner = new RedisRunner({
  service: env.redis1ioredis_service,
  host: env.redis1ioredis_host,
  port: Number(env.redis1ioredis_port),
  password: env.redis1ioredis_password,
})

const zookeeper1confluentincRunner = new ZooKeeperRunner({
  service: env.zookeeper1confluentinc_service,
  port: Number(env.zookeeper1confluentinc_port),
})

const kafka1confluentincRunner = new KafkaRunner({
  service: env.kafka1confluentinc_service,
  ports: {
    9092: Number(env.kafka1confluentinc_port1),
    // 9093: Number(env.kafka1confluentinc_port2),
    // 9094: Number(env.kafka1confluentinc_port3),
  },
  dependsOn: [zookeeper1confluentincRunner],
})

const dockest = new Dockest({
  logLevel: logLevel.VERBOSE,
  afterSetupSleep: 5,
  dev: {
    idling: env.CI === 'true' || false, // Shouldn't idle in the pipeline
  },
  jest: {
    // tslint:disable-next-line
    lib: require('jest'),
    verbose: true,
  },
  runners: {
    ...(env.postgres1sequelize_enabled === 'true' || env.CI === 'true'
      ? { postgres1sequelizeRunner }
      : {}),
    ...(env.postgres2knex_enabled === 'true' || env.CI === 'true' ? { postgres2knexRunner } : {}),
    ...(env.redis1ioredis_enabled === 'true' ? { redis1ioredisRunner } : {}),
    ...(env.kafka1confluentinc_enabled === 'true' ? { kafka1confluentincRunner } : {}),
  },
})

dockest.run()
