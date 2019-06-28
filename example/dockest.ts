// tslint:disable:no-console

import dotenv from 'dotenv'
import Dockest, { logLevel, runners } from '../src'

const env: any = dotenv.config().parsed
const IS_CLI = env.CI === 'true'
const { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } = runners

const postgres1sequelizeRunner = new PostgresRunner({
  commands: [
    'sequelize db:migrate:undo:all',
    'sequelize db:migrate',
    'sequelize db:seed:undo:all',
    'sequelize db:seed --seed 20190101001337-demo-user',
  ],
  database: env.postgres1sequelize_database,
  host: env.postgres1sequelize_host,
  password: env.postgres1sequelize_password,
  port: Number(env.postgres1sequelize_port),
  service: env.postgres1sequelize_service,
  username: env.postgres1sequelize_username,
})

const postgres2knexRunner = new PostgresRunner({
  commands: [
    './node_modules/knex/bin/cli.js migrate:rollback',
    './node_modules/knex/bin/cli.js migrate:latest',
    './node_modules/knex/bin/cli.js seed:run',
  ],
  database: env.postgres2knex_database,
  host: env.postgres2knex_host,
  password: env.postgres2knex_password,
  port: Number(env.postgres2knex_port),
  service: env.postgres2knex_service,
  username: env.postgres2knex_username,
})

const redis1ioredisRunner = new RedisRunner({
  host: env.redis1ioredis_host,
  password: env.redis1ioredis_password,
  port: Number(env.redis1ioredis_port),
  service: env.redis1ioredis_service,
})

const zookeeper1confluentincRunner = new ZooKeeperRunner({
  port: Number(env.zookeeper1confluentinc_port),
  service: env.zookeeper1confluentinc_service,
})

const kafka1confluentincRunner = new KafkaRunner({
  dependsOn: [zookeeper1confluentincRunner],
  port: Number(env.kafka1confluentinc_port1),
  ports: { 9092: Number(env.kafka1confluentinc_port1) },
  service: env.kafka1confluentinc_service,
})

const configuredJest = {
  // tslint:disable-next-line
  lib: require('jest'),
  verbose: true,
}
const configuredRunners = [
  ...(env.postgres1sequelize_enabled === 'true' || IS_CLI ? [postgres1sequelizeRunner] : []),
  ...(env.postgres2knex_enabled === 'true' || IS_CLI ? [postgres2knexRunner] : []),
  ...(env.redis1ioredis_enabled === 'true' ? [redis1ioredisRunner] : []),
  ...(env.kafka1confluentinc_enabled === 'true' ? [kafka1confluentincRunner] : []),
]
const dockestConfig = {
  afterSetupSleep: 20,
  dev: { idling: IS_CLI || true },
  exitHandler: () => console.log('👋🏼 from custom exitHandler'),
  logLevel: logLevel.VERBOSE,
  runInBand: true,
}

const dockest = new Dockest(configuredJest, configuredRunners, dockestConfig)

dockest.run()
