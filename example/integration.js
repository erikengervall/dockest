const { default: Dockest } = require('../built')

const config = {
  jest: {
    lib: require('jest'),
    silent: false, // true
    verbose: false, // false
    forceExit: true, // false
    watchAll: false, // ?
    projects: ['.'], // null
  },
  postgres: [
    {
      seeder: '20181130152743-demo-user',
      connectionTimeout: 60,
      responsivenessTimeout: 60,
      label: 'dockest.project=postgres1',
      username: 'erik',
      password: 'secretpw',
      db: 'dab',
      host: 'localhost',
      port: 5434,
      service: 'postgres1',
    },
  ],
  dockest: {
    verbose: true,
    exitHandler: error => {
      console.log('error', error)
    },
    dockerComposeFile: 'docker-compose-test.yml',
  },
}

Dockest(config)
