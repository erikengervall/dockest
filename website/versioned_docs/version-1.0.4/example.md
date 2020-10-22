---
id: version-1.0.4-example
title: Example
sidebar_label: Example
original_id: example
---

Check out [`example/dockest.ts`](https://github.com/erikengervall/dockest/tree/master/example) for an example.

## TypeScript

Note that [`ts-jest`](https://www.npmjs.com/package/ts-jest) and [`ts-node`](https://www.npmjs.com/package/ts-node) are recommended, but completely optional.

**`jest.config.js`** (skip if not using `ts-jest`)

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
    "ts-jest": "^26.4.1",
    "ts-node": "^9.0.0"
  }
}
```

<br>
**`dockest.ts`**

```TypeScript
import Dockest, { runners } from 'dockest'

const dockest = new Dockest({
  runners: [
    new runners.RedisRunner({
      service: 'insert-service-name-here',
    }),
  ],
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
  runners: { RedisRunner },
} = require('dockest')

const dockest = new Dockest({
  runners: [
    new RedisRunner({
      service: 'insert-service-name-here',
    }),
  ],
})

dockest.run()
```
