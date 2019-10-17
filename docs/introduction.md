---
id: introduction
title: Introduction
sidebar_label: Introduction
---

## Motivation

The original motivation for Dockest, along with real world examples, can be read in this [blog article](https://engineering.klarna.com/node-js-integration-testing-with-ease-fab5f8d29163).

> Dockest was born out of frustration and with a vision to make developers’ lives slightly less miserable.

Dockest provides an abstraction for your Docker services’ lifecycles during integration testing, freeing developers from convoluted and flaky shell scripts. Adopting Dockest is super easy regardless if you’ve got existing tests or not and doesn’t necessarily require additional CI pipeline steps.

## Requirements

Dockest has a few system requirements in order to work:

- Dockest uses Jest's programmatic CLI and requires Jest **v20.0.0** or newer to work
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/) (_"On desktop systems like Docker Desktop for Mac and Windows, Docker Compose is included as part of those desktop installs."_)

## Contributing

**Setup and testing**

This repo uses [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) together with [lerna](https://github.com/lerna/lerna).

- `yarn` Installs all dependencies. Bear in mind that yarn workspaces [hoists](https://yarnpkg.com/lang/en/docs/workspaces/#toc-limitations-caveats) dependencies
- `yarn build` Transpiles packages that requires transpiling
- `yarn test` Tests packages by using the library. The library itself is also unit tested using Jest
