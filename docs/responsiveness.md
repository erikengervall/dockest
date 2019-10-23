---
id: responsiveness
title: Responsiveness
sidebar_label: Responsiveness
---

The responsiveness healthcheck is used for determining when a container is ready. E.g. when the Database is ready or the HTTP server has started.

The standard runners (Redis, Postgres, ZooKeeper, Kafka) already have a healthcheck implemented. E.g. the PostgresRunner tries to run a trivial `SELECT` query.

The responsiveness healthcheck will run until it succeeds or fail once the responsivenessTimeout is reached.

### WIP

In case you are using the GeneralPurposeRunner you can implement your own responsiveness check via the [`getResponsivenessCheckCommand` config option](runner-general-purpose-runner.md).
