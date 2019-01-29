import dotenv from 'dotenv'

import Dockest, { runners } from '../src/index'

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
// @ts-ignore
const zookeeper = new ZookeeperRunner({
  service: zookeeperService,
  port: zookeeperPort,
})

// @ts-ignore
const kafka1kafkajs = new KafkaRunner({
  service: 'kafka1wurstmeister',
  host: 'localhost',
  topics: ['Topic1:1:3', 'Topic2:1:1:compact'],
  zookeepeerConnect: `${zookeeperService}:${zookeeperPort}`,
  autoCreateTopics: true,
  ports: {
    '9092': '9092', // kafka
    '9093': '9093', // kafka
    '9094': '9094', // kafka
    '9082': '8081', // TODO: registry (https://hub.docker.com/r/confluentinc/cp-schema-registry/)
  },
})

const integration = new Dockest({
  dockest: {
    verbose: true,
  },
  jest: {
    lib: require('jest'),
  },
  runners: {
    postgres1sequelize,
    postgres2knex,
    zookeeper,
    kafka1kafkajs,
  },
})

integration.run()
