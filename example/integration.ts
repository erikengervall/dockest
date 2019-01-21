import dotenv from 'dotenv'
// @ts-ignore
// import { seedBanana, seedUser } from './fixture.json'

import Dockest, { runners } from '../src/index'

// Dockest.jestRanWithResult = true
// console.log('data', seedBanana, seedUser)
// process.exit(2)

const env: any = dotenv.config().parsed
const { PostgresRunner } = runners

const integration = new Dockest({
  dockest: {},
  jest: {
    lib: require('jest'),
  },
  runners: {
    postgres1sequelize: new PostgresRunner({
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
    }),
    postgres2knex: new PostgresRunner({
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
    }),
  },
})

integration.run()
