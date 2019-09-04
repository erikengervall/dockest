---
id: runner_simple
title: Simple
sidebar_label: Simple
---

General purpose runner.

## Minimal working example

```TypeScript
const opts = {
  service: 'insert-service-here', // Should match the Compose file's intended service
}

new RedisRunner(opts)
```

## Interface

| Prop              | Required | Type                      | Default            | Description                                                                                                                                                             |
| ----------------- | -------- | ------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| service           | true     | string                    | -                  | Used as an identifiers and, if no `image` option is passed, to find the image from your Compose file                                                                    |
| commands          | false    | string[]                  | []                 | Custom commands that execute _once_ after service responsiveness has been established                                                                                   |
| connectionTimeout | false    | number                    | 3                  | How long to wait for the resource to be reachable                                                                                                                       |
| dependsOn         | false    | Runner[]                  | []                 | Defines the [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) of the service                                                                     |
| host              | false    | string                    | 'localhost'        | Hostname of redis instance                                                                                                                                              |
| image             | false    | string, undefined or null | undefined          | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from. If you plan on building your image via docker-compose, pass null. |
| ports             | false    | { [key: string]: string } | { '1337': '8080' } | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#short-syntax-1)                                                                             |

## Healthchecks

1. Runs [connectivity](connectivity.md) check
