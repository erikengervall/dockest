# Dockest

`Dockest` is a small library that executes jest unit tests together with your application's dependencies.

## Usage
`Dockest` requires configuration in order to run. The following is a minimal example of how to run `Dockest` with postgres.

```javascript
const { default: dockest } = require('dockest')

const config = {
  jest: {
    lib: require('jest'),
  },
  postgres: [
    {
      label: 'dockest.project=matchDockerCompose',
      username: 'user',
      password: 'pass',
      db: 'database',
      host: 'localhost',
      port: 5432,
      service: 'matchDockerCompose',
      commands: [
        'sequelize db:migrate:undo:all',
        'sequelize db:migrate',
        'sequelize db:seed:undo:all ',
        'sequelize db:seed --seed 20181130152743-insert-seed-file',
      ],
    },
  ],
}

dockest(config)
```
