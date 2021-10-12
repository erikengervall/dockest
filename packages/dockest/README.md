# Dockest

Dockest is an integration testing tool aimed at alleviating the process of evaluating unit tests whilst running
multi-container Docker applications.

<p align="center">
  <a href='https://erikengervall.github.io/dockest/'><img alt="dockest logo" width="300px" src="https://raw.githubusercontent.com/erikengervall/dockest/master/resources/img/logo.png"></a>
</p>

<br>
<br>

<p align="center">
  <img alt="licence" src="https://github.com/erikengervall/dockest/workflows/Node.js%20CI/badge.svg">

  <a href="https://www.npmjs.com/package/dockest">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/dockest">
  </a>

  <a href="https://github.com/erikengervall/dockest/blob/master/LICENSE">
    <img alt="licence" src="https://img.shields.io/npm/l/dockest">
  </a>

  <a href="https://app.netlify.com/sites/dockest/deploys">
    <img alt="licence" src="https://api.netlify.com/api/v1/badges/36a8e5f8-42bf-402a-93a3-ba05ff7462b6/deploy-status">
  </a>

  <a href="https://snyk.io/test/github/erikengervall/dockest">
    <img alt="snyk" src="https://snyk.io/test/github/erikengervall/dockest/badge.svg">
  </a>
<p>

## Why Dockest

The value that Dockest provides over e.g. plain docker-compose is that it figures out the connectivity and
responsiveness status of each individual service (either synchronously or asynchronously) and once all services are
ready the tests run.

## Example

```sh
yarn add dockest --dev
```

```yml
# docker-compose.yml

version: '3.8'

services:
  myRedis:
    image: redis:5.0.3-alpine
    ports:
      - published: 6379
        target: 6379
```

```ts
// dockest.ts

import { Dockest, logLevel } from 'dockest'

const dockest = new Dockest()

const dockestServices = [
  {
    serviceName: 'myRedis', // Match with configuration in docker-compose.yml
  },
]

dockest.run(dockestServices)
```

## Documentation

Learn more about Dockest on the [official website](https://dockest.netlify.app/).

## Contributing

If you'd like to contribute, start by searching through the issues and pull requests to see whether someone else has
raised a similar idea or question.

If you don't see your idea listed, and you think it fits into the goals of this guide, do one of the following:

- If your contribution is **minor**, such as a typo fix, open a pull request.
- If your contribution is **major**, such as a new feature, start by opening an issue first. That way, other people can
  weigh in on the discussion before you do any work.

## Acknowledgements

Thanks to [Juan Lulkin](https://github.com/joaomilho) for the logo ❤️

Thanks to [Laurin Quast](https://github.com/n1ru4l) for great ideas and contributions 💙

## License

MIT
