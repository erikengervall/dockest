import dotenv from 'dotenv'
import Dockest, { logLevel, runners } from '../../src'

const env: any = dotenv.config().parsed
const { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } = runners

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
  },
})

const dockest = new Dockest({
  opts: {
    afterSetupSleep: 10,
    dev: {
      // debug: true,
    },
    dumpErrors: true,
    exitHandler: ({ trap }) => console.log(`Hello ${trap}, nice to meet you 👋🏼`), // eslint-disable-line no-console
    logLevel: logLevel.DEBUG,
  },
})

dockest.attachRunners([postgres1sequelizeRunner, postgres2knexRunner, redis1ioredisRunner, kafka1confluentincRunner])

dockest.run()
