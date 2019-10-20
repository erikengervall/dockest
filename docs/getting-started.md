---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

## Install

Install Dockest using [`yarn`](https://yarnpkg.com/en/package/jest):

```bash
yarn add --dev dockest
```

or [`npm`](https://www.npmjs.com/):

```bash
npm install --save-dev dockest
```

## Create application

Let's create a small example and see it in action!

First, let's create a function `cache.ts` that uses a Redis store to cache an arbitrary number:

```ts
export const cacheKey = 'arbitraryNumberKey'

export const setCache = (redisClient: Redis, arbitraryNumber: number) => {
  redisClient.set(cacheKey, arbitraryNumber)
}
```

## Create unit test

Then, create a test file `cache.spec.ts` to test the caching functionality:

```ts
import Redis from 'redis-client-of-choice'
import { cacheKey, setCache } from './cache'

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
})

it('should cache an arbitrary number', async () => {
  const arbitraryNumber = 5

  await setCache(redisClient, arbitraryNumber)

  const cachedValue = await redisClient.get(cacheKey)
  expect(cachedValue).toEqual(arbitraryNumber)
})
```

## Configure Dockest

Next step is to transform this unit test into an integration test by creating a `dockest.ts` file. There's two ways of passing resources to Dockest, either by referencing a Compose file or attaching runners programmatically.

### Alternative 1

Create a Compose file containing a Redis store `dockest_redis`:

```yml
# docker-compose-redis.yml
version: '3.7'
services:
  dockest_redis:
    image: 'redis:5.0.3-alpine'
    ports:
      - published: 6379
        target: 6379
```

Pass the Compose file in the Dockest configuration:

```ts
import Dockest, { runners } from 'dockest'

const dockest = new Dockest({
  opts: {
    composeFile: 'docker-compose-redis.yml',
  },
})

dockest.run()
```

### Alternative 2

Attach a RedisRunner to Dockest using `dockest.attachRunners`.

```ts
import Dockest, { runners } from 'dockest'

const dockest = new Dockest({})

dockest.attachRunners([
  new runners.RedisRunner({
    host: 'localhost',
    ports: [
      {
        published: 6379,
        target: 6379,
      },
    ],
  }),
])

dockest.run()
```

## Configure scripts

Configure your `package.json`'s test script. For TypeScript, [`ts-node`](https://www.npmjs.com/package/ts-node) is a practical library for running your tests.

```json
{
  "scripts": {
    "test": "ts-node ./dockest.ts"
  }
}
```

Finally, run `yarn test` or `npm run test`.
