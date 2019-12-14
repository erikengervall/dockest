---
id: interfaces
title: Interfaces
sidebar_label: Interfaces
---

## Dockest constructor

### Reference usage

```ts
import { Dockest } from 'dockest'

const { run } = new Dockest({ opts, jest })
```

### opts

| Prop            | Required | Type     | Default              | Description                                                                                                                                           |
| --------------- | -------- | -------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| afterSetupSleep | false    | number   | 0                    | Additional sleep after initial setup. Useful when services require additional time to boot and there's no applicable healthcheck                      |
| composeFile     | false    | string   | 'docker-compose.yml' | Compose file(s) with services to use while running tests                                                                                              |
| debug           | false    | boolean  | false                | Pauses Dockest just before executing Jest. Useful for more rapid development using Jest manually                                                      |
| dumpErrors      | false    | boolean  | false                | Serializes errors and dumps them in `dockest-error.json`. Useful for debugging.                                                                       |
| exitHandler     | false    | function | null                 | Callback that will run before exit. Received one argument of type { type: string, code?: number, signal?: any, error?: Error, reason?: any, p?: any } |
| logLevel        | false    | number   | 2 (logLevel.NORMAL)  | Sets the log level between 0 and 4                                                                                                                    |
| runInBand       | false    | boolean  | true                 | Initializes and runs the Runners in sequence. Disabling this could increase performance                                                               |

### jest

| Prop      | Required | Type     | Default         | Description                                                                                                                                                                                                 |
| --------- | -------- | -------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lib       | false    | object   | require('jest') | The Jest library itself, typically passed as { lib: require('jest') }. If omitted, Dockest will attempt to require Jest from your application's dependencies. If absent, Dockest will use it's own version. |
| projects  | false    | string[] | ['.']           | https://jestjs.io/docs/en/cli.html#projects-path1-pathn-                                                                                                                                                    |
| runInBand | false    | boolean  | true            | https://jestjs.io/docs/en/cli.html#runinband                                                                                                                                                                |

_Note: Jest runs tests in parallel per default, which is why Dockest defaults `runInBand` to `true`. This will cause jest to run sequentially in order to avoid race conditions for I/O operations. This may lead to longer runtimes._

An exhaustive list of CLI-options can be found in [Jest's](https://jestjs.io/docs/en/cli.html) documentation.

## Dockest method `run`

### Reference usage

```ts
import { Dockest } from 'dockest'

const { run } = new Dockest()

const dockestServices = [
  {
    serviceName,
    commands,
    healthchecks,
  },
]

run(dockestServices)
```

### dockestService

| Prop         | Required | Type       | Default | Description                                                                                                                                                                                                                                                                       |
| ------------ | -------- | ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name         | true     | string     | -       | Service name that matches the corresponding service in your Compose file.                                                                                                                                                                                                         |
| commands     | false    | string[]   | []      | Commands to be executed upon service readiness. E.g. migration scripts for databases.                                                                                                                                                                                             |
| healthchecks | false    | function[] | []      | Functions that generate commands to determine the service's health. E.g. responsiveness checking a database using `select 1`. The healthchecks receive the corresponding Compose service configuration from the Compose file as first argument and the containerId as the second. |
