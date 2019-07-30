---
id: example
title: Example usage
sidebar_label: Example usage
---

## Usage

Check out `example/dockest.ts` for an example usage.

### TypeScript

For TypeScript projects it's recommended to use `ts-jest` in order to avoid having to compile TypeScript on every change when running Jest.

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

### Javascript

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
