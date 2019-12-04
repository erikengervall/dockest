# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [<version>] - <date>

### Removed

- Removed `typedoc`

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
