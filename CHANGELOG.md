# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2019-08-30

### Added

- New logo 🎉
- Supports services being referenced as a dependency multiple times

### Fixed

- Jest commands work when including projects

## [1.0.2] - 2019-08-20

### Added

- SimpleRunner
- Support for parsing of Compose Files as well as supplying runners with individual images.
- Support for parallelism of Jest and healthchecking Runner.

## [1.0.0] - 2019-07-22

### Added

- KafkaRunner
- ZooKeeperRunner
- PostgresRunner
- RedisRunner

### Changed

- Improvements to Dockest's interface (breaking change)
- Improved logging structure
- Improved test coverage
- Added `typedoc` for automatic documentation generation
- Migrated from `docker-compose run` to `docker-compose up` due to limitation in network accessibility between services (I'm looking at you Kafka & ZooKeeper)
