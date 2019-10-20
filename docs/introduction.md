---
id: introduction
title: Introduction
sidebar_label: Introduction
---

## Motivation

The original motivation for Dockest, along with real world examples, can be read in this [blog article](https://engineering.klarna.com/node-js-integration-testing-with-ease-fab5f8d29163).

> Dockest was born out of frustration and with a vision to make developers’ lives slightly less miserable.

Dockest provides an abstraction for your Docker services’ lifecycles during integration testing, freeing developers from convoluted and flaky shell scripts. Adopting Dockest is super easy regardless if you’ve got existing tests or not and doesn’t necessarily require additional CI pipeline steps.

## Use cases

All use cases has a corresponding example application under [`packages/examples`](https://github.com/erikengervall/dockest/tree/master/packages/examples).

### AWS CodeBuild

What is AWS CodeBuild?

> [AWS CodeBuild is a fully managed continuous integration service that compiles source code, runs tests, and produces software packages that are ready to deploy.](https://aws.amazon.com/codebuild)

Cool, can I run it locally?

> [You can now locally test and debug your AWS CodeBuild builds using the new CodeBuild local agent.](https://hub.docker.com/r/amazon/aws-codebuild-local)

### Node to node

Dockest can of course also build and run application services as part of your integration tests!

### Application with lots of resources

Integration testing applications with multiple resources requires a lot of work. With Dockest, the setup phase of multiple resources is made a lot easier and comprehensive.

## System requirements

Dockest has a few system requirements in order to work:

- Dockest uses Jest's programmatic CLI and requires Jest **v20.0.0** or newer to work
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/) (_"On desktop systems like Docker Desktop for Mac and Windows, Docker Compose is included as part of those desktop installs."_)

## Contributing

**Setup and testing**

This repo uses [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) together with [lerna](https://github.com/lerna/lerna), which means that all `yarn` scripts can be run from root.

- `yarn` Installs all dependencies. Bear in mind that yarn workspaces [hoists](https://yarnpkg.com/lang/en/docs/workspaces/#toc-limitations-caveats) dependencies
- `yarn build` Compiles typescript
- `yarn test` Runs unit tests for the library itself as well as a number of integration tests found under `packages/examples`
