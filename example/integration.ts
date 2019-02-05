import dotenv from 'dotenv'

import Dockest, { logLevel, runners } from '../src/index'

const env: any = dotenv.config().parsed
const { KafkaRunner, PostgresRunner, ZookeeperRunner } = runners

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

const zookeeperService = 'zookeeper1wurstmeister'
const zookeeperPort = 2181
const zookeepeerConnect = `${zookeeperService}:${zookeeperPort}`
// @ts-ignore
const zookeeper = new ZookeeperRunner({
  service: zookeeperService,
  port: zookeeperPort,
})

// @ts-ignore
const kafka1kafkajs = new KafkaRunner({
  service: 'kafka1wurstmeister',
  host: 'localhost',
  topics: [env.kafka_topic],
  zookeepeerConnect,
  autoCreateTopics: true,
  ports: {
    '9092': '9092', // kafka
    '9093': '9093', // kafka
    '9094': '9094', // kafka
    '9082': '8081', // TODO: registry (https://hub.docker.com/r/confluentinc/cp-schema-registry/)
  },
})

const myRunners: any = {}
myRunners.postgres1sequelize = postgres1sequelize
if (env.postgres2knex_enabled === 'true') {
  myRunners.postgres2knex = postgres2knex
}
if (env.kafka_enabled === 'true') {
  myRunners.zookeeper = zookeeper
}
if (env.kafka_enabled === 'true') {
  myRunners.kafka1kafkajs = kafka1kafkajs
}
// console.log('myRunners', myRunners)
// Dockest.jestRanWithResult = true
// process.exit(1)

const integration = new Dockest({
  dockest: {
    logLevel: logLevel.NORMAL,
  },
  jest: {
    lib: require('jest'),
  },
  runners: myRunners,
})

integration.run()
