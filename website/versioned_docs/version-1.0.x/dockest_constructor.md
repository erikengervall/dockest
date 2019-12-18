---
id: version-1.0.x-dockest_constructor
title: Dockest constructor
sidebar_label: Dockest constructor
original_id: dockest_constructor
---

## Usage

```TypeScript
const docker = new Dockest({
  runners,
  jest,
  opts,
})
```

## Interface

| Prop    | Required | Type   | Default                               | Description                      |
| ------- | -------- | ------ | ------------------------------------- | -------------------------------- |
| runners | true     | array  | []                                    | [Runner instances](runner_redis) |
| jest    | false    | object | see docs for [Jest](jest)             | Jest configuration               |
| opts    | false    | object | see [below](dockest_constructor#opts) | Dockest configuration            |

## opts

| Prop            | Required | Type               | Default             | Description                                                                                                                                           |
| --------------- | -------- | ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| afterSetupSleep | false    | number             | 0                   | Additional sleep after initial setup. Useful when resources require additional time to boot                                                           |
| dev             | false    | { debug: boolean } | { debug: false }    | Pauses Jest execution indefinitely. Useful for debugging Jest while resources are running                                                             |
| composeFileName | false    | string             | docker-compose.yml  | The name of your Compose file. This is required if you do **not** pass the image property for each Runner                                             |
| exitHandler     | false    | function           | null                | Callback that will run before exit. Received one argument of type { type: string, code?: number, signal?: any, error?: Error, reason?: any, p?: any } |
| logLevel        | false    | number             | 2 (logLevel.NORMAL) | Sets the log level between 0 and 4                                                                                                                    |
| runInBand       | false    | boolean            | true                | Initializes and runs the Runners in sequence. Disabling this could increase performance                                                               |
