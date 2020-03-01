---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

## Install

Install Dockest using [`yarn`](https://yarnpkg.com/en/package/jest) or [`npm`](https://www.npmjs.com/) (we'll be using `yarn` for the rest of the documentation):

```bash
yarn add --dev dockest
# npm install --save-dev dockest
```

## Example application

Let's create a small example and see it in action!

We begin by creating a function `cache.ts` that uses a Redis store to cache an arbitrary number:

```ts
export const cacheKey = 'arbitraryNumberKey'

export const setCache = (redisClient: Redis, arbitraryNumber: number) => {
  redisClient.set(cacheKey, arbitraryNumber)
}
```

### Create unit test

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

### Configure Dockest

The next step is to transform this unit test into an integration test by creating a `docker-compose.yml` and `dockest.ts` file.

> **Important note for the Compose file**
>
> Dockest expects services' ports to be defined using [long format](https://docs.docker.com/compose/compose-file/#long-syntax-1) and works best with high versions of docker-compose (i.e. 3.7 or higher)

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

// Specify the services from the Compose file that should be included in the integration test
const dockestServices = [
  {
    serviceName: 'myRedis', // Must match a service in the Compose file
  },
]

dockest.run(dockestServices)
```

### Configure scripts

Configure your `package.json`'s test script. For TypeScript, [`ts-node`](https://www.npmjs.com/package/ts-node) is a practical library for running your tests without adding a compilation step.

```json
{
  "scripts": {
    "test": "ts-node ./dockest"
  },
  "devDependencies": {
    "dockest": "..."
  }
}
```

### Run

Finally, run the tests:

```sh
yarn test
```
