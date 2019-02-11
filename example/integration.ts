import dotenv from 'dotenv'

// @ts-ignore
import Dockest, { logLevel, runners } from '../src/index'

const env: any = dotenv.config().parsed
// @ts-ignore
const { KafkaRunner, PostgresRunner, RedisRunner, ZookeeperRunner } = runners

// @ts-ignore
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

// @ts-ignore
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

const zookeeperService = env.zookeeper_service
const zookeeperPort = Number(env.zookeeper_port)
const zookeepeerConnect = `${zookeeperService}:${zookeeperPort}`
// @ts-ignore
const zookeeper = new ZookeeperRunner({
  service: zookeeperService,
  port: zookeeperPort,
})

// @ts-ignore
const kafka1kafkajs = new KafkaRunner({
  service: env.kafka_service,
  host: env.kafka_host,
  topics: [env.kafka_topic],
  zookeepeerConnect,
  autoCreateTopics: true,
  ports: {
    [env.kafka_port1]: env.kafka_port1,
    [env.kafka_port2]: env.kafka_port2,
    [env.kafka_port3]: env.kafka_port3,
    zookeeperPort: `${zookeeperPort}`,
  },
})

// @ts-ignore
const redis1ioredis = new RedisRunner({
  service: env.redis1ioredis_service,
  password: env.redis1ioredis_password,
})

const myRunners: any = {}
if (env.postgres1sequelize_enabled === 'true') {
  myRunners.postgres1sequelize = postgres1sequelize
}
if (env.postgres2knex_enabled === 'true') {
  myRunners.postgres2knex = postgres2knex
}
if (env.zookeeper_enabled === 'true') {
  myRunners.zookeeper = zookeeper
}
if (env.kafka_enabled === 'true') {
  myRunners.kafka1kafkajs = kafka1kafkajs
}
if (env.redis1ioredis_enabled === 'true') {
  myRunners.redis1ioredis = redis1ioredis
}

const dockest = new Dockest({
  dockest: {
    logLevel: logLevel.VERBOSE,
  },
  jest: {
    lib: require('jest'),
    verbose: true,
  },
  runners: myRunners,
})

dockest.run()
