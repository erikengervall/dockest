---
id: runner-zookeeper
title: ZooKeeper
sidebar_label: ZooKeeper
---

## Minimal working example

```ts
const opts = {
  service: 'insert-service-here', // Should match the Compose file's intended service
}

new ZooKeeperRunner(opts)
```

## Interface

This interface is an extension of the [shared props](runner-sharedprops).

| Prop  | Required | Type                                    | Default                               | Description                                                                                |
| ----- | -------- | --------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| ports | false    | { published: number, target: number }[] | `[{ published: 2181, target: 2181 }]` | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#long-syntax-1) |

## Static members

| Static member | Type   | Value       |
| ------------- | ------ | ----------- |
| DEFAULT_HOST  | string | 'localhost' |
| DEFAULT_PORT  | string | 2181        |

## Healthchecks

1. Runs [connectivity](connectivity.md) check
