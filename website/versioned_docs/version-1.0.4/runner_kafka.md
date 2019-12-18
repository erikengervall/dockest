---
id: version-1.0.4-runner_kafka
title: Kafka
sidebar_label: Kafka
original_id: runner_kafka
---

## Minimal working example

```TypeScript
const opts = {
  service: 'insert-service-here', // Should match the Compose file's intended service
  dependsOn: [
    new ZooKeeperRunner({
      service: 'insert-zookeeper-service-here',
      port: 'insert-zookeeper-port-here',
    }),
  ],
  ports: { '9092': '9092' },
}

new KafkaRunner(opts)
```

## Interface

| Prop              | Required | Type                      | Default            | Description                                                                                          |
| ----------------- | -------- | ------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| service           | true     | string                    | -                  | Used as an identifiers and, if no `image` option is passed, to find the image from your Compose file |
| dependsOn         | true     | Runner[]                  | []                 | Defines the service's [dependencies](https://docs.docker.com/compose/compose-file/#depends_on)       |
| autoCreateTopics  | false    | boolean                   | true               | Whether or not Kafka should auto-create topics                                                       |
| commands          | false    | string[]                  | []                 | Custom commands that execute _once_ after service responsiveness has been established                |
| connectionTimeout | false    | number                    | 30                 | How long to wait for the resource to be reachable                                                    |
| host              | false    | string                    | 'localhost'        | Hostname                                                                                             |
| image             | false    | string                    | undefined          | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from |
| ports             | false    | { [key: string]: string } | { '9092': '9092' } | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#short-syntax-1)          |

## Static members

| Static member                | Type   | Value       |
| ---------------------------- | ------ | ----------- |
| DEFAULT_HOST                 | string | 'localhost' |
| DEFAULT_PORT_PLAINTEXT       | string | '9092'      |
| DEFAULT_PORT_SASL_SSL        | string | '9094'      |
| DEFAULT_PORT_SCHEMA_REGISTRY | string | '8081'      |
| DEFAULT_PORT_SSL             | string | '9093'      |

## Healthchecks

1. Runs [connectivity](connectivity) check
