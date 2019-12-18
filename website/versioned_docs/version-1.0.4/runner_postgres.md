---
id: version-1.0.4-runner_postgres
title: Postgres
sidebar_label: Postgres
original_id: runner_postgres
---

## Minimal working example

helo

```TypeScript
const opts = {
  service: 'insert-service-here', // Should match the Compose file's intended service
  database: 'insert-database-here',
  password: 'insert-password-here',
  username: 'insert-username-here',
}

new PostgresRunner(opts)
```

## Interface

| Prop                  | Required | Type                      | Default            | Description                                                                                          |
| --------------------- | -------- | ------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| service               | true     | string                    | -                  | Used as an identifiers and, if no `image` option is passed, to find the image from your Compose file |
| database              | true     | string                    | -                  | Database's name                                                                                      |
| password              | true     | string                    | -                  | Database's password                                                                                  |
| username              | true     | string                    | -                  | Database's username                                                                                  |
| commands              | false    | string[]                  | []                 | Custom commands that execute _once_ after service responsiveness has been established                |
| connectionTimeout     | false    | number                    | 3                  | How long to wait for the resource to be reachable                                                    |
| dependsOn             | false    | Runner[]                  | []                 | Defines the [dependencies](https://docs.docker.com/compose/compose-file/#depends_on) of the service  |
| host                  | false    | string                    | 'localhost'        | Hostname of database                                                                                 |
| image                 | false    | string or undefined       | undefined          | Specify the [image](https://docs.docker.com/compose/compose-file/#image) to start the container from |
| ports                 | false    | { [key: string]: string } | { '5432': '5432' } | [{ hostPort: containerPort }](https://docs.docker.com/compose/compose-file/#short-syntax-1)          |
| responsivenessTimeout | false    | number                    | 10                 | How long to wait for the resource to be reachable                                                    |

## Static members

| Static member | Type   | Value       |
| ------------- | ------ | ----------- |
| DEFAULT_HOST  | string | 'localhost' |
| DEFAULT_PORT  | string | '5432'      |

## Healthchecks

1. Runs [connectivity](connectivity) check
2. Runs [responsiveness](responsiveness) check by querying the database with `select 1`
