const { postgres1sequelize, postgres2knex } = require('./env')

const sequelize = {
  label: postgres1sequelize.label,
  username: postgres1sequelize.username,
  password: postgres1sequelize.password,
  db: postgres1sequelize.database,
  host: postgres1sequelize.host,
  port: postgres1sequelize.port,
  service: postgres1sequelize.service,
  connectionTimeout: 15,
  responsivenessTimeout: 15,
  commands: [
    'sequelize db:migrate:undo:all',
    'sequelize db:migrate',
    'sequelize db:seed:undo:all',
    'sequelize db:seed --seed 20190101001337-demo-user',
  ],
}

const knex = {
  label: postgres2knex.label,
  username: postgres2knex.username,
  password: postgres2knex.password,
  db: postgres2knex.database,
  host: postgres2knex.host,
  port: postgres2knex.port,
  service: postgres2knex.service,
  connectionTimeout: 15,
  responsivenessTimeout: 15,
  commands: [
    './node_modules/knex/bin/cli.js migrate:rollback',
    './node_modules/knex/bin/cli.js migrate:latest',
    './node_modules/knex/bin/cli.js seed:run',
  ],
}

const ioredis = {
  host: 1,
}

module.exports = {
  jest: {
    lib: require('jest'),
  },
  postgres: [sequelize, knex],
  dockest: {
    verbose: true,
    exitHandler: error => {
      console.log('error', error)
    },
    dockerComposeFilePath: './docker-compose-integration.yml',
  },
}
