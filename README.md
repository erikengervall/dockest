# Dockest

`Dockest` is a small library that executes Jest alongside with your application's dependencies.

[![travis](https://travis-ci.com/erikengervall/dockest.svg?branch=master)](https://travis-ci.com/erikengervall/dockest)

![npm downloads](https://img.shields.io/npm/dm/dockest.svg?style=flat)

![licence](https://img.shields.io/npm/l/dockest.svg?style=flat)

<p align="center">
  <a href="https://www.npmjs.com/package/swc">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/dockest.svg?style=flat">
  </a>
  <a href="https://crates.io/crates/swc_ecma_parser">
    <img alt="undefined" src="https://img.shields.io/crates/d/swc_ecma_parser.svg?label=crates.io%20dowloads">
  </a>
</p>

## Requirements

`Dockest` requires at least Jest **v20.0.0** in order to ensure Jest's [CLI interface](https://github.com/facebook/jest/blob/master/packages/jest-cli/src/cli/index.js#L62).

## Runners

### [Postgres](https://hub.docker.com/_/postgres)

```typescript
new PostgresRunner({
  service: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'username',
  password: 'password',
  database: 'database',
  commands: [
    'sequelize db:migrate:undo:all',
    'sequelize db:migrate',
    'sequelize db:seed:undo:all',
    'sequelize db:seed --seed 20190101001337-demo-user',
  ],
})
```

### [Redis](https://hub.docker.com/_/redis)

```typescript
new RedisRunner({
  service: 'redis',
  host: 'localhost',
  port: 6379,
  password: 'password',
})
```

### (WIP) [Zookeeper](https://hub.docker.com/r/wurstmeister/zookeeper/) & [Kafka](https://hub.docker.com/r/wurstmeister/kafka)

```typescript
const zookeeperService = 'zookeeper1wurstmeister'
const zookeeperPort = 2181
const zookeeperConnect = `${zookeeperService}:${zookeeperPort}`
new ZookeeperRunner({
  service: zookeeperService,
  port: zookeeperPort,
})

new KafkaRunner({
  service: 'kafka1wurstmeister',
  host: 'localhost',
  topics: ['topic:1:1'], // topicname:partitions:replicas
  zookeeperConnect,
  autoCreateTopics: true,
  ports: {
    '9092': '9092', // kafka
    '9093': '9093', // kafka
    '9094': '9094', // kafka
    zookeeperPort: `${zookeeperPort}`, // zookeeper
  },
})
```

## Basic usage

### Typescript

`jest.config.js`

```js
module.exports = {
  preset: 'ts-jest',
}
```

`package.json`

```json
{
  "scripts": {
    "test": "ts-node ./integration.ts"
  },
  "devDependencies": {
    "ts-jest": "^23.10.5",
    "ts-node": "^8.0.2"
  }
}
```

`dockest.ts`

```typescript
import Dockest, { runners } from 'dockest'

const { PostgresRunner } = runners

const postgres = new PostgresRunner({
  service: 'insert-docker-compose-service-name-here',
  username: 'insert-username-here',
  password: 'insert-password-here',
  database: 'insert-database-here',
})

const integration = new Dockest({
  jest: {
    lib: require('jest'),
  },
  runners: {
    postgres,
  },
})

integration.run()
```

## Contributing

- `yarn install:all`: Installs all dependencies and necessary git-hooks
- `yarn test:all`: Runs `yarn test` and `yarn test:example`
  - `yarn test`: Runs jest for _./Dockest/src_
  - `yarn test:example`: Runs `yarn test` from _./example_

## License

MIT
