# Dockest

Dockest is an integration testing tool aimed at alleviating the process of evaluating unit tests whilst running multi-container Docker applications.

<p align="center">
  <img alt="dockest logo" src="https://raw.githubusercontent.com/erikengervall/dockest/master/dev-toolbox/logo/pinterest_profile_image.png">
</p>

<p align="center">
  <a href="https://travis-ci.com/erikengervall/dockest">
    <img alt="licence" src="https://img.shields.io/travis/com/erikengervall/dockest.svg?style=flat">
  </a>
  <a href="https://www.npmjs.com/package/dockest">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/dockest.svg?style=flat">
  </a>
  <a href="https://github.com/erikengervall/dockest/blob/master/LICENSE">
    <img alt="licence" src="https://img.shields.io/npm/l/dockest.svg?style=flat">
  </a>
<p>

## Requirements

- At least Jest **v20.0.0** because Dockest calls Jest's CLI programmatically
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/) (_"On desktop systems like Docker Desktop for Mac and Windows, Docker Compose is included as part of those desktop installs."_)

## Usage

Check out `example/dockest.ts` for an example usage.

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
    "test": "ts-node ./dockest.ts"
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

const dockest = new Dockest({
  jest: {
    lib: require('jest'),
  },
  runners: {
    postgres: new PostgresRunner({
      service: 'insert-docker-compose-service-name-here',
      database: 'insert-database-here',
      username: 'insert-username-here',
      password: 'insert-password-here',
    }),
  },
})

dockest.run()
```

### Javascript

`dockest.js`

```javascript
const {
  default: Dockest,
  runners: { PostgresRunner },
} = require('dockest')

const dockest = new Dockest({
  jest: {
    lib: require('jest'),
  },
  runners: {
    postgres: new PostgresRunner({
      service: 'insert-docker-compose-service-name-here',
      database: 'insert-database-here',
      username: 'insert-username-here',
      password: 'insert-password-here',
    }),
  },
})

dockest.run()
```

# Dockest constructor

```typescript
const docker = new Dockest({
  ...opts,
  jest,
  runners,
})
```

## Opts

It's possible to pass custom configuration to Dockest in order to improve developer experience.

### Interface

| Prop            | Required | Type     | Default             | Description                                                                                                               |
| --------------- | -------- | -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| logLevel        | false    | number   | 2 (logLevel.NORMAL) | Sets the log level between 0 and 4                                                                                        |
| exitHandler     | false    | function | () => void          | Custom function which will be invoced upon exiting the process                                                            |
| afterSetupSleep | false    | number   | 20                  | Additional sleep after initial setup. Will only be executed if there's at least one KafkaRunner present. Set to 0 to skip |

## Jest

### Interface

| Prop      | Required | Type     | Default   | Description                                              |
| --------- | -------- | -------- | --------- | -------------------------------------------------------- |
| lib       | true     | object   | -         | The Jest library itself                                  |
| projects  | false    | string[] | ['.']     | https://jestjs.io/docs/en/cli.html#projects-path1-pathn- |
| silent    | false    | boolean  | undefined | https://jestjs.io/docs/en/cli.html#silent                |
| verbose   | false    | boolean  | undefined | https://jestjs.io/docs/en/cli.html#verbose               |
| forceExit | false    | boolean  | undefined | https://jestjs.io/docs/en/cli.html#forceexit             |
| watchAll  | false    | boolean  | undefined | https://jestjs.io/docs/en/cli.html#watchall              |

## Runners

### [Postgres](https://hub.docker.com/_/postgres)

```typescript
new PostgresRunner({
  service: 'insert-docker-compose-service-name-here',
  database: 'insert-database-here',
  username: 'insert-username-here',
  password: 'insert-password-here',
})
```

#### Interface

| Prop                  | Required | Type     | Default     | Description                                             |
| --------------------- | -------- | -------- | ----------- | ------------------------------------------------------- |
| service               | true     | string   | -           | Should match designated docker-compose resource         |
| database              | true     | string   | -           | Name of the database                                    |
| username              | true     | string   | -           | User of the database                                    |
| password              | true     | string   | -           | Password for user of the database                       |
| host                  | false    | string   | 'localhost' | Hostname of database                                    |
| port                  | false    | number   | 5432        | Port of database                                        |
| commands              | false    | string[] | []          | Custom commands that will be executed _once_ upon setup |
| connectionTimeout     | false    | number   | 3           | How long to wait for the resource to be reachable       |
| responsivenessTimeout | false    | number   | 10          | How long to wait for the resource to be reachable       |

### [Redis](https://hub.docker.com/_/redis)

```typescript
new RedisRunner({
  service: 'insert-docker-compose-service-name-here',
})
```

#### Interface

| Prop                  | Required | Type     | Default     | Description                                             |
| --------------------- | -------- | -------- | ----------- | ------------------------------------------------------- |
| service               | true     | string   | -           | Should match designated docker-compose resource         |
| host                  | false    | string   | 'localhost' | Hostname of redis instance                              |
| port                  | false    | number   | 6379        | Port of redis instance                                  |
| password              | false    | string   | ''          | Password to redis instance                              |
| commands              | false    | string[] | []          | Custom commands that will be executed _once_ upon setup |
| connectionTimeout     | false    | number   | 3           | How long to wait for the resource to be reachable       |
| responsivenessTimeout | false    | number   | 10          | How long to wait for the resource to be reachable       |

### (WIP) [Zookeeper](https://hub.docker.com/r/wurstmeister/zookeeper/) & [Kafka](https://hub.docker.com/r/wurstmeister/kafka)

```typescript
const zookeeperService = 'zookeeper1wurstmeister'
const zookeeperPort = 2181
new ZookeeperRunner({
  service: zookeeperService,
  port: zookeeperPort,
})

new KafkaRunner({
  service: 'kafka1wurstmeister',
  topics: ['topic:1:1'], // topicName:partitions:replicas
  zookeeperConnect: `${zookeeperService}:${zookeeperPort}`,
  ports: {
    '9092': '9092', // kafka
    '9093': '9093', // kafka
    '9094': '9094', // kafka
    [zookeeperPort]: `${zookeeperPort}`, // zookeeper
  },
})
```

#### Zookepeer Interface

| Prop              | Required | Type   | Default | Description                                       |
| ----------------- | -------- | ------ | ------- | ------------------------------------------------- |
| service           | true     | string | -       | Should match designated docker-compose resource   |
| port              | false    | number | 2181    | This will be the exposed port from your resource  |
| connectionTimeout | false    | number | 30      | How long to wait for the resource to be reachable |

#### Kafka Interface

| Prop              | Required | Type                  | Default                                            | Desciption                                                         |
| ----------------- | -------- | --------------------- | -------------------------------------------------- | ------------------------------------------------------------------ |
| service           | true     | string                | -                                                  | Should match designated docker-compose resource                    |
| topics            | true     | string[]              | -                                                  | Topics for testing                                                 |
| zookeeperConnect  | false    | string                | -                                                  | host:port connection configuration towards your Zookeeper instance |
| host              | false    | string                | 'localhost'                                        | Hostname                                                           |
| ports             | false    | object{string:string} | { '9092': '9092', '9093': '9093', '9094': '9094' } | Port mappings with format `external:inside container`              |
| autoCreateTopics  | false    | boolean               | true                                               | Whether or not Kafka should auto-create topics                     |
| connectionTimeout | false    | number                | 30                                                 | How long to wait for the resource to be reachable                  |

## Contributing

- `yarn dev:setup`: Installs all dependencies and necessary git-hooks
- `yarn test:all`: Runs `yarn test:unit:dockest` and `yarn test:integration:example`
  - `yarn test:unit:dockest`: Trivial unit tests for the library itself
  - `yarn test:integration:example`: Runs Dockest from the example

## License

MIT
