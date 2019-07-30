---
id: dockest_constructor
title: Dockest constructor
sidebar_label: Dockest constructor
---

## Interface

| Prop    | Required | Type   | Default | Description |
| ------- | -------- | ------ | ------- | ----------- |
| runners | true     | array  | -       | TODO:       |
| jest    | false    | object | -       | TODO:       |
| opts    | false    | object | -       | TODO:       |

## opts

| Prop            | Required | Type               | Default             | Description                                                                                                                                           |
| --------------- | -------- | ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| afterSetupSleep | false    | number             | 0                   | Additional sleep after initial setup. Useful when resources require additional time to boot                                                           |
| dev             | false    | { debug: boolean } | { debug: false }    | Pauses Jest execution indefinitely. Useful for debugging Jest while resources are running                                                             |
| composeFileName | false    | string             | docker-compose.yml  | The name of your Compose file. This is required if you do **not** pass the image property for each Runner                                             |
| exitHandler     | false    | function           | null                | Callback that will run before exit. Recieved one argument of type { type: string, code?: number, signal?: any, error?: Error, reason?: any, p?: any } |
| logLevel        | false    | number             | 2 (logLevel.NORMAL) | Sets the log level between 0 and 4                                                                                                                    |
| runInBand       | false    | boolean            | true                | Initializes and runs the Runners in sequence. Disabling this could increase performance                                                               |

```TypeScript
const docker = new Dockest({
  runners,
  jest,
  opts,
})
```
