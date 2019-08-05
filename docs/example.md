---
id: example
title: Example
sidebar_label: Example
---

Check out [`example/dockest.ts`](https://github.com/erikengervall/dockest/tree/master/example) for an example.

## TypeScript

Note that `ts-jest` and `ts-node` are recommended, but completely optional.

**`jest.config.js`** (Skip if not using `ts-jest`)

```JavaScript
module.exports = {
  preset: 'ts-jest',
}
```

<br>
**`package.json`**

```JSON
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

<br>
**`dockest.ts`**

```TypeScript
import Dockest, { runners } from 'dockest'

const { RedisRunner } = runners

const myRedisRunner = new RedisRunner({
service: 'insert-service-name-here',
})

const dockest = new Dockest({
runners: [myRedisRunner],
})

dockest.run()

```

## Javascript

**`package.json`**

```JSON
{
  "scripts": {
    "test": "node ./dockest.ts"
  }
}
```

<br>
`dockest.js`

```JavaScript
const {
  default: Dockest,
  runners: { PostgresRunner },
} = require('dockest')

const myRedisRunner = new RedisRunner({
  service: 'insert-service-name-here',
})

const dockest = new Dockest({
  runners: [myRedisRunner],
})

dockest.run()
```