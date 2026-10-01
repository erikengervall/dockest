# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.0] - Unreleased

### Fixed

- Containers are torn down when a run fails, is interrupted or crashes. The exit handler iterated a runner list that
  was always empty, so a failed startup, an uncaught error or Ctrl+C left every container running
  [#236](https://github.com/erikengervall/dockest/issues/236), [#141](https://github.com/erikengervall/dockest/issues/141)
- `SIGTERM` (sent when a CI job is cancelled) tears down the containers; the process exits with 128 + the signal number
- A failure inside `Dockest.run` tears down the containers even when the caller catches the rejection
- A custom `exitHandler` that throws no longer keeps the containers from being torn down
- Compose files without the obsolete `version` key are accepted. `docker compose config` drops the key, so Dockest
  failed with "Unable to find required field 'version'" for files written to the current Compose Specification
- Services without `ports` are accepted again (a 3.1.0 regression)
  [#143](https://github.com/erikengervall/dockest/issues/143)
- Ports without a published host port (`- "6379"`) and environment variables declared without a value are accepted
- Absolute `composeFile` paths and paths containing spaces work
- A refused connection during the port check is retried instead of crashing the run
- Docker events split across output chunks are no longer dropped, which surfaced as a 30 second start timeout
- `skipCheckConnection` is honored; it was hardcoded to `false`
- `resolveServiceAddress` and `getServiceAddress` accept a string target port
  [#300](https://github.com/erikengervall/dockest/issues/300) and name the missing port in their error
- The networks Compose creates for the project are removed on teardown; every run left one behind
- Container log files are flushed before the process exits
- Errors in the exit handler log and `dockest-error.json` are serialized instead of printed as `{}`
- The Jest version check compares major versions numerically

### Changed

- The `docker compose` plugin is preferred; the standalone `docker-compose` binary is the fallback
- `jest` is a peer dependency (`>=20.0.0`). Dockest always required it at runtime
- Dockest no longer replaces the global zod error map when it is imported
- Upgraded `js-yaml` to 3.15, `execa` to 5, `zod` to 3.25 and `zod-validation-error` to 3.5, clearing the
  security advisories in Dockest's runtime dependencies
- Test suites and test utilities are no longer published in `dist`
- Releases publish through npm trusted publishing (GitHub OIDC) with provenance attestations instead of a long-lived npm
  token
- `next` builds publish as `<patch + 1>-next.<run>.g<sha>` so they sort above the latest release, and prerelease
  tags publish under their own dist-tag

## [3.1.0] - 2023-10-23

### Changed

- **Breaking:** Only the long port syntax is supported in the parsed Compose output
  [#362](https://github.com/erikengervall/dockest/pull/362)
- **Breaking:** Requires Node.js 18 or later
- **Breaking:** Source files were renamed to kebab-case, which breaks deep imports such as `dockest/dist/...`
- Replaced `io-ts` and `fp-ts` with `zod` and `zod-validation-error` for Compose file validation; validation
  errors read differently
- A published port may be a string or a number [#378](https://github.com/erikengervall/dockest/issues/378)
- Moved the docs into the README and removed the website [#386](https://github.com/erikengervall/dockest/pull/386)
- Upgraded to TypeScript 5 and Jest 29

### Known issues

- Services without `ports` fail validation (fixed in 3.2.0)

## [3.0.1] - 2022-02-02

### Fixed

- Add support for handling the trimming of version field from `docker compose config` command
  [#284](https://github.com/erikengervall/dockest/pull/284)

## [3.0.0] - 2021-10-12

### Changed

- Website: Migrated docs from gh-pages to Netlify
- Website: Removed versioning from site itself. Versions will instead be available on a separate page on the website
  pointing towards source docs in GitHub for that version.

## [3.0.0-beta.0] - 2021-09-13

### Added

- Add configurable readiness retry count [#200](https://github.com/erikengervall/dockest/pull/200)
- Overhaul readiness checks & introduce `dockest/readiness-check`
  [#212](https://github.com/erikengervall/dockest/pull/212)
- Add container log collection [#167](https://github.com/erikengervall/dockest/pull/167)
- feat: replace dependents with dependsOn option [#213](https://github.com/erikengervall/dockest/pull/213)
- Migrated website from docusaurus 1 to docusaurus 2 (beta.6) [#264](https://github.com/erikengervall/dockest/pull/264)

### Fixed

- Correctly handle services that have no ports defined [#210](https://github.com/erikengervall/dockest/pull/210)

### Changed

- Make Dockest opts optional [#263](https://github.com/erikengervall/dockest/pull/263)

## [2.1.0] - 2020-10-22

### Added

- Added dependencies `io-ts` and `fp-ts`

### Fixed

- docker-compose file decoding [#184](https://github.com/erikengervall/dockest/pull/184)

## [2.0.2] - 2020-04-18

### Added

- Support for docker-in-docker [#166](https://github.com/erikengervall/dockest/pull/166)
- New helper `resolveServiceAddress` [#162](https://github.com/erikengervall/dockest/pull/162)
- Added option to skip port connectivity check [#163](https://github.com/erikengervall/dockest/pull/163)

## [2.0.1] - 2020-03-12

### Fixed

- Automatically transform legacy port mappings to the new format
  [#154](https://github.com/erikengervall/dockest/pull/154)

### Changed

- If no ports are provided for a service, the checkConnection step is skipped (a log message will however appear)
  [#154](https://github.com/erikengervall/dockest/pull/154)

## [2.0.0] - 2020-03-01

Other than the changes below, there's everything that has been introduced from the previous pre-releases.

The reasoning for this major release can be read in the
[PR](https://github.com/erikengervall/dockest/pull/139#issue-376790491), but also right here:

> I feel that this library has matured into its second major release. The parts I felt uncomfortable with have been
> removed (e.g. the initial concept of Runners) and the library has evolved into something a lot more user-friendly.
>
> It should be major because the interface has completely changed towards the user.
>
> It should be bumped at this point in time because the interface has reached a stable state and there has been
> extensive local testing.

### Changed

- Renamed healthchecks to readinessChecks to avoid confusion with
  [Docker's healthcheck](https://docs.docker.com/engine/reference/builder/#healthcheck)
- Improved documentation

## [2.0.0-beta.2] - 2020-02-12

### Changed

- Adopted RxJS to listen in on docker events, greatly improving the responsiveness and sturdiness of all checks
  [#136](https://github.com/erikengervall/dockest/pull/136)
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

- Added the option to pass `dependent` Dockest Services to Dockest Services. Essentially creating a more robust
  `depends_on`
- Added Dockest options for forwarding compose CLI options for `docker-compose <opts> up`. E.g. `--build` or
  `--force-recreate`

### Changed

- Changed Dockest Services `healthchecks` prop to a `healthcheck` prop. Instead of passing an array of functions, simply
  implement a single healthcheck function that'll be called recursively until successful or times out. The `healthcheck`
  function is also fed default healthcheck functions.
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
- Migrated from `docker-compose run` to `docker-compose up` due to limitation in network accessibility between services
  (I'm looking at you Kafka & ZooKeeper)
