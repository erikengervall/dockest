---
id: version-1.0.x-runner_zookeeper
title: ZooKeeper
sidebar_label: ZooKeeper
original_id: runner_zookeeper
---

## Minimal working example

```TypeScript
const opts = {
  service: 'insert-service-here', // Should match the Compose file's intended service
}

new ZooKeeperRunner(opts)
```

## Interface

| Prop              | Required | Type                      | Default            | Description                                                                                          |
| ----------------- | -------- | ------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| service           | true     | string                    | -                  | Used as an identifiers and, if no `image` option is passed, to find the image from your Compose file |
| commands          | false    | string[]                  | []                 | Custom commands that execute _once_ after service responsiveness has been established                |
| connectionTimeout | false    | number                    | 30                 | How long to wait for the resource to be reachable                                                    |
| dependsOn         | false    | Runner[]                  | []                 | Defines the [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) of the service  |
| host              | false    | string                    | 'localhost'        | Hostname of zookeeper instance                                                                       |
| image             | false    | string or undefined       | undefined          | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from |
| ports             | false    | { [key: string]: string } | { '2181': '2181' } | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#short-syntax-1)          |

## Static members

| Static member | Type   | Value       |
| ------------- | ------ | ----------- |
| DEFAULT_HOST  | string | 'localhost' |
| DEFAULT_PORT  | string | '2181'      |

## Healthchecks

1. Runs [connectivity](connectivity.md) check
