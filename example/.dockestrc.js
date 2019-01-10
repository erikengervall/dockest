const { postgres1 } = require('./env')

module.exports = {
  jest: {
    lib: require('jest'),
  },
  postgres: [
    {
      label: postgres1.label,
      username: postgres1.username,
      password: postgres1.password,
      db: postgres1.db,
      host: postgres1.host,
      port: postgres1.port,
      service: postgres1.service,
      connectionTimeout: 15,
      responsivenessTimeout: 15,
      commands: [
        'sequelize db:migrate:undo:all',
        'sequelize db:migrate',
        'sequelize db:seed:undo:all',
        'sequelize db:seed --seed 20181130152743-demo-user',
      ],
    },
  ],
  dockest: {
    verbose: true,
    exitHandler: error => {
      console.log('error', error)
    },
    dockerComposeFilePath: './docker-compose-integration.yml',
  },
}
