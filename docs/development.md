---
id: development
title: Development
sidebar_label: Development
---

## Publishing a new version

- Create a new branch
- Update `CHANGELOG.md` with all the relevant changes since the last release by
  [comparing commits](https://github.com/kafkajs/confluent-schema-registry/compare/v1.0.5...master) since last release
- Bump the `package.json` version and create a corresponding tag using `npm version <major | minor | patch>`
- Push changes to your branch
- Create PR, wait for successful builds
- Merge PR
- Push tags `git push --tags`, this will trigger a CI job which publishes the new version on `npm`.

## Notes

- Jest [26.0.0 (2020-05-15)](https://github.com/kulshekhar/ts-jest/blob/master/CHANGELOG.md#2600-2020-05-15) dropped
  support for Nodejs 8. This also causes issues such as `globalThis is not defined` for Nodejs 10. Be wary. Considering
  Nodejs 12 is currently LTS (as of Oct 2020), please consider upgrading from Nodejs 10.
