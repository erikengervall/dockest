import dotenv from 'dotenv'
import Dockest, { logLevel, runners } from 'dockest'

const env: any = dotenv.config().parsed
const { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } = runners

const postgres1sequelizeRunner = new PostgresRunner({
  service: 'dockest_inline_service_name_postgres1sequelizeRunner',
  image: 'postgres:9.6-alpine',
  commands: [
    'sequelize db:migrate:undo:all',
    'sequelize db:migrate',
    'sequelize db:seed:undo:all',
    'sequelize db:seed --seed 20190101001337-demo-user',
  ],
  database: env.postgres1sequelize_database,
  password: env.postgres1sequelize_password,
  ports: [
    {
      published: env.postgres1sequelize_port,
      target: PostgresRunner.DEFAULT_PORT,
    },
  ],
  username: env.postgres1sequelize_username,
})

const postgres2knexRunner = new PostgresRunner({
  service: env.postgres2knex_service,
  image: 'postgres:9.6-alpine',
  commands: ['knex migrate:rollback', 'knex migrate:latest', 'knex seed:run'],
  database: env.postgres2knex_database,
  host: PostgresRunner.DEFAULT_HOST,
  password: env.postgres2knex_password,
  ports: [
    {
      published: env.postgres2knex_port,
      target: PostgresRunner.DEFAULT_PORT,
    },
  ],
  username: env.postgres2knex_username,
})

const redis1ioredisRunner = new RedisRunner({
  service: env.redis1ioredis_service,
  image: 'redis:5.0.3-alpine',
  ports: [
    {
      published: env.redis1ioredis_port,
      target: RedisRunner.DEFAULT_PORT,
    },
  ],
})

const zookeeper1confluentincRunner = new ZooKeeperRunner({
  service: env.zookeeper1confluentinc_service,
  image: 'confluentinc/cp-zookeeper:5.2.2',
  ports: [
    {
      published: env.zookeeper1confluentinc_port,
      target: ZooKeeperRunner.DEFAULT_PORT,
    },
  ],
})

const kafka1confluentincRunner = new KafkaRunner({
  service: env.kafka1confluentinc_service,
  image: 'confluentinc/cp-kafka:5.2.2',
  dependsOn: [zookeeper1confluentincRunner],
  ports: [
    {
      published: env.kafka1confluentinc_port1,
      target: KafkaRunner.DEFAULT_PORT_PLAINTEXT,
    },
  ],
})

const dockest = new Dockest({
  opts: {
    afterSetupSleep: 20,
    dumpErrors: true,
    exitHandler: ({ trap }) => console.log(`Hello ${trap}, nice to meet you 👋🏼`), // eslint-disable-line no-console
    logLevel: logLevel.DEBUG,
  },
})

dockest.attachRunners([postgres1sequelizeRunner, postgres2knexRunner, redis1ioredisRunner, kafka1confluentincRunner])

dockest.run()
