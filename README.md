# Dockest

`Dockest` is a small library that executes Jest alongside with your application's dependencies.

## Requirements

`Dockest` requires at least Jest **v20.0.0** in order to ensure Jest's [CLI interface](https://github.com/facebook/jest/blob/master/packages/jest-cli/src/cli/index.js#L62).

## Supported runners

### [Postgres](https://hub.docker.com/_/postgres)

```javascript
const {
  runners: { PostgresRunner },
} = require('dockest')

new PostgresRunner({
  username: 'username',
  password: 'password',
  database: 'database',
  host: 'localhost',
  port: 5432,
  service: 'postgres',
  commands: [
    'sequelize db:migrate:undo:all',
    'sequelize db:migrate',
    'sequelize db:seed:undo:all',
    'sequelize db:seed --seed 20190101001337-demo-user',
  ],
})
```

### (WIP) [Kafka](https://hub.docker.com/r/wurstmeister/kafka)

```javascript
const {
  runners: { KafkaRunner, ZookeeperRunner },
} = require('dockest')

const zookeeperService = 'zookeeper1wurstmeister'
const zookeeperPort = 2181
const zookeepeerConnect = `${zookeeperService}:${zookeeperPort}`
new ZookeeperRunner({
  service: zookeeperService,
  port: zookeeperPort,
})

new KafkaRunner({
  service: 'kafka1wurstmeister',
  host: 'localhost',
  topics: ['topic:1:1'], // topicname:partitions:replicas
  zookeepeerConnect,
  autoCreateTopics: true,
  ports: {
    '9092': '9092', // kafka
    '9093': '9093', // kafka
    '9094': '9094', // kafka
    '9082': '8081', // schema registry
  },
})
```

## Basic usage

```javascript
const {
  default: Dockest,
  runners: { PostgresRunner },
} = require('dockest')

const myPostgresRunner = new PostgresRunner({
  username: 'username',
  password: 'password',
  database: 'database',
  host: 'localhost',
  port: 5432,
  service: 'postgres',
  commands: [
    'sequelize db:migrate:undo:all',
    'sequelize db:migrate',
    'sequelize db:seed:undo:all',
    'sequelize db:seed --seed 20190101001337-demo-user',
  ],
})

const integration = new Dockest({
  jest: {
    lib: require('jest'),
  },
  runners: {
    myPostgresRunner,
  },
})

integration.run()
```
