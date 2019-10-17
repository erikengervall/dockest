---
id: runner_kafka
title: Kafka
sidebar_label: Kafka
---

## Minimal working example

```ts
new KafkaRunner({
  service: 'insert-service-here',
  image: 'confluentinc/cp-kafka:5.2.2',
  dependsOn: [
    new ZooKeeperRunner({
      service: 'insert-zookeeper-service-here',
      ports: [{ published: 2181, target: 2181 }],
    }),
  ],
  ports: [{ published: 9092, target: 9092 }],
})
```

## Interface

This interface is an extension of the [shared props](runner_sharedprops).

| Prop             | Required | Type                                    | Default                               | Description                                                                                    |
| ---------------- | -------- | --------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| dependsOn        | true     | Runner[]                                | `[]`                                  | Defines the service's [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) |
| autoCreateTopics | false    | boolean                                 | `true`                                | Whether or not Kafka should auto-create topics                                                 |
| ports            | false    | { published: number, target: number }[] | `[{ published: 9092, target: 9092 }]` | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#long-syntax-1)     |

## Static members

| Static member                | Type   | Value       |
| ---------------------------- | ------ | ----------- |
| DEFAULT_HOST                 | string | 'localhost' |
| DEFAULT_PORT_PLAINTEXT       | string | 9092        |
| DEFAULT_PORT_SASL_SSL        | string | 9094        |
| DEFAULT_PORT_SCHEMA_REGISTRY | string | 8081        |
| DEFAULT_PORT_SSL             | string | 9093        |

## Healthchecks

1. Runs [connectivity](connectivity.md) check
