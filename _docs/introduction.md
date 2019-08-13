---
id: introduction
title: Introduction
sidebar_label: Introduction
---

## Motivation

The motivation for Dockest, along with real world examples, can be read in this [blog article](https://engineering.klarna.com/node-js-integration-testing-with-ease-fab5f8d29163).

<br>
**TL;DR** *(excerpts from the article)*

> Dockest was born out of frustration and with a vision to make developers’ lives slightly less miserable.

> ## Dockest’s core concepts
>
> Dockest provides abstraction for your Docker services’ lifecycles as well as making sure that your unit tests are executed. Adopting Dockest is super easy regardless if you’ve got existing tests or not and doesn’t necessarily require additional CI pipeline steps.
>
> Dockest’s core concept is composed of runners. Runners are references to Docker services, listed in your Compose file, that your application depend on. The runners are structured to be independent of one another, not only to simplify the configuration of Dockest itself, but also to lower the threshold for anyone to contribute with new runners for unsupported Docker services.

## Requirements

Dockest has a few system requirements in order to work:

- Dockest uses Jest's programmatic CLI and requires Jest **v20.0.0** or newer to work
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/) (_"On desktop systems like Docker Desktop for Mac and Windows, Docker Compose is included as part of those desktop installs."_)

## Contributing

**Setup and testing**

- `yarn dev:setup` Installs all dependencies and necessary git-hooks
- `yarn test:all` Runs `yarn test` and `yarn test:example`
  - `yarn test` Unit tests for the library itself
  - `yarn test:example` Integration tests using Dockest
