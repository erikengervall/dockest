---
id: runner-redis
title: Redis
sidebar_label: Redis
---

## Minimal working example

```ts
new RedisRunner({
  service: 'insert-service-here', // Should match the Compose file's intended service
})
```

## Interface

This interface is an extension of the [shared props](runner-sharedprops).

| Prop     | Required | Type                                    | Default                               | Description                                                                                |
| -------- | -------- | --------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| password | false    | string                                  | ''                                    | Password to redis instance                                                                 |
| ports    | false    | { published: number, target: number }[] | `[{ published: 6379, target: 6379 }]` | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#long-syntax-1) |

## Static members

| Static member | Type   | Value       |
| ------------- | ------ | ----------- |
| DEFAULT_HOST  | string | 'localhost' |
| DEFAULT_PORT  | string | 6379        |

## Healthchecks

1. Runs [connectivity](connectivity.md) check
2. Runs [responsiveness](responsiveness.md) check by querying redis with `PING`
