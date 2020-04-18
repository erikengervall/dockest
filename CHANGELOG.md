# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] - 2020-04-18

### Added

- Support for docker-in-docker [#166](https://github.com/erikengervall/dockest/pull/166)
- New helper `resolveServiceAddress` [#162](https://github.com/erikengervall/dockest/pull/162)
- Added option to skip port connectivity check [#163](https://github.com/erikengervall/dockest/pull/163)

## [2.0.1] - 2020-03-12

### Fixed

- Automatically transform legacy port mappings to the new format [#154](https://github.com/erikengervall/dockest/pull/154)

### Changed

- If no ports are provided for a service, the checkConnection step is skipped (a log message will however appear) [#154](https://github.com/erikengervall/dockest/pull/154)

## [2.0.0] - 2020-03-01

Other than the changes below, there's everything that has been introduced from the previous pre-releases.

The reasoning for this major release can be read in the [PR](https://github.com/erikengervall/dockest/pull/139#issue-376790491), but also right here:

> I feel that this library has matured into its second major release. The parts I felt uncomfortable with have been removed (e.g. the initial concept of Runners) and the library has evolved into something a lot more user-friendly.
>
> It should be major because the interface has completely changed towards the user.
>
> It should be bumped at this point in time because the interface has reached a stable state and there has been extensive local testing.

### Changed

- Renamed healthchecks to readinessChecks to avoid confusion with [Docker's healthcheck](https://docs.docker.com/engine/reference/builder/#healthcheck)
- Improved documentation

## [2.0.0-beta.2] - 2020-02-12

### Changed

- Adopted RxJS to listen in on docker events, greatly improving the responsiveness and sturdiness of all checks [#136](https://github.com/erikengervall/dockest/pull/136)
- Support function as a command with containerId as argument [#133](https://github.com/erikengervall/dockest/pull/133)

## [2.0.0-beta.1] - 2020-02-01

### Added

- Expose sleepWithLog
- Move chalk to dependencies

### Changed

- Bump dependencies throughout the repo
- Internals: Introduce a Mutables field that contains mutable fields, e.g. runners

## [2.0.0-beta.0] - 2020-01-24

### Added

- Added the option to pass `dependent` Dockest Services to Dockest Services. Essentially creating a more robust `depends_on`
- Added Dockest options for forwarding compose CLI options for `docker-compose <opts> up`. E.g. `--build` or `--force-recreate`

### Changed

- Changed Dockest Services `healthchecks` prop to a `healthcheck` prop. Instead of passing an array of functions, simply implement a single healthcheck function that'll be called recursively until successful or times out. The `healthcheck` function is also fed default healthcheck functions.
- Made documentation more verbose and descriptive

## [2.0.0-alpha.3] - 2019-12-18

### Added

- GitHub Actions: Pipeline automation for npm & website releases
- Drop pipeline support for Node.js 8.x due to its [EOL end of 2019](https://nodejs.org/en/about/releases/)

### Removed

- Travis pipeline, relying solely on GitHub Actions

## [2.0.0-alpha.2] - 2019-12-14

### Added

- Introduced `DockestServices`, servicing as the interface for users to specify which services to spin up during testing
- Introduced custom healthcheck that can be passed along with the `DockestServices`

### Removed

- Removed `typedoc`
- Removed `attachRunners`

### Changed

- Moved concept of `Runners` from a public interface to an internal one

## [2.0.0-alpha.1] - 2019-10-24

### Added

- Introduced monorepo structure using yarn workspaces and lerna
- Use compose CLI for merging compose files #82
- Allow containers to connect to host machine/dockest inside container support #91

### Changed

- Broke out runners from Dockest constructor and introduced `attachRunners` method
- Started moving towards relying heavier on compose files rather than supplying runners that'll generate compose files

## [1.0.3] - 2019-08-30

### Added

- New logo 🎉 #69
- Supports services being referenced as a dependency multiple times #68

### Fixed

- Jest commands work when including projects #66 #53

### Changed

- Bumped all dependencies #67

## [1.0.2] - 2019-08-20

### Added

- SimpleRunner #63
- Support for parsing of Compose Files as well as supplying runners with individual images. #55
- Support for parallelism of Jest and healthchecking Runner. #55

## [1.0.0] - 2019-07-22

### Added

- KafkaRunner #55
- ZooKeeperRunner #55
- PostgresRunner
- RedisRunner #40

### Changed

- Improvements to Dockest's interface (breaking change)
- Improved logging structure
- Improved test coverage
- Added `typedoc` for automatic documentation generation
- Migrated from `docker-compose run` to `docker-compose up` due to limitation in network accessibility between services (I'm looking at you Kafka & ZooKeeper)
