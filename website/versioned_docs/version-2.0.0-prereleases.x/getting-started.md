---
id: version-2.0.0-prereleases.x-getting-started
title: Getting Started
sidebar_label: Getting Started
original_id: getting-started
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
import Redis from 'ioredis' // ... or client of choice
import { cacheKey, setCache } from './cache'

const redisClient = new Redis({
  host: 'localhost',
  port: 6379, // Match with configuration in docker-compose.yml
})

it('should cache an arbitrary number', async () => {
  const arbitraryNumber = 5

  await setCache(redisClient, arbitraryNumber)

  const cachedValue = await redisClient.get(cacheKey)
  expect(cachedValue).toEqual(arbitraryNumber)
})
```

## Configure Dockest

The next step is to transform this unit test into an integration test by creating a `docker-compose.yml` and `dockest.ts` file.

```yml
# docker-compose.yml

version: '3.7'

services:
  myRedis:
    image: redis:5.0.3-alpine
    ports:
      - published: 6379
        target: 6379
```

```ts
// dockest.ts

import { Dockest } from 'dockest'

const dockest = new Dockest()

const services = [
  {
    serviceName: 'myRedis', // Match with configuration in docker-compose.yml
  },
]

dockest.run(services)
```

## Configure scripts

Configure your `package.json`'s test script. For TypeScript, [`ts-node`](https://www.npmjs.com/package/ts-node) is a practical library for running your tests without adding a compilation step.

```json
{
  "scripts": {
    "test": "ts-node ./dockest"
  }
}
```

Finally, run `yarn test` or `npm run test`.

## Under the hood

`ts-node ./dockest` will initiate a series of events:

- Merging of Compose file (if multiple)
- Spin up services (only those provided via `run`)
- Perform [connectivity](getting-started#connectivity-checks) check towards services
- Perform healthchecks
- Execute provided commands
- Run Jest
- Evaluate result
- Teardown of running services
- Exit

### Connectivity checks

Recursively attempts to establish a connection with the Docker service using the Node.js native [net](https://nodejs.org/api/net.html#net_net_createconnection) module.

The connectivity healthcheck will fail once the connectionTimeout is reached.
