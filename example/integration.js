const {
  default: Dockest,
  runners: { PostgresRunner },
} = require('../built')
const { postgres1sequelize, postgres2knex } = require('./env')

const integration = new Dockest({
  dockest: {
    dockerComposeFilePath: './docker-compose-integration.yml',
  },
  jest: {
    lib: require('jest'),
  },
  runners: {
    postgres1sequelize: new PostgresRunner({
      label: postgres1sequelize.label,
      username: postgres1sequelize.username,
      password: postgres1sequelize.password,
      database: postgres1sequelize.database,
      host: postgres1sequelize.host,
      port: postgres1sequelize.port,
      service: postgres1sequelize.service,
      commands: [
        'sequelize db:migrate:undo:all',
        'sequelize db:migrate',
        'sequelize db:seed:undo:all',
        'sequelize db:seed --seed 20190101001337-demo-user',
      ],
    }),
    postgres2knex: new PostgresRunner({
      label: postgres2knex.label,
      username: postgres2knex.username,
      password: postgres2knex.password,
      db: postgres2knex.database,
      host: postgres2knex.host,
      port: postgres2knex.port,
      service: postgres2knex.service,
      commands: [
        './node_modules/knex/bin/cli.js migrate:rollback',
        './node_modules/knex/bin/cli.js migrate:latest',
        './node_modules/knex/bin/cli.js seed:run',
      ],
    }),
  },
})

integration.run()
