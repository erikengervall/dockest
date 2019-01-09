# Dockest

`Dockest` is a small library that executes jest unit tests together with your application's dependencies.

## Usage
`Dockest` requires configuration in order to run. The following is a minimal example of how to run `Dockest` with a postgres container (without explicit commands, `Dockest` defaults to the ORM Sequelize).

```javascript
const { default: dockest } = require('dockest')

const config = {
  jest: {
    lib: require('jest'),
  },
  postgres: [
    {
      seeder: '20190101133700-demo',
      label: 'dockest.project=matchDockerCompose',
      username: 'user',
      password: 'pass',
      db: 'database',
      host: 'localhost',
      port: 5432,
      service: 'matchDockerCompose',
    },
  ],
}

dockest(config)
```
