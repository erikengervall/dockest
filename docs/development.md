---
id: development
title: Development
sidebar_label: Development
---

## Publishing a new version

- Run `yarn bump` from root
  - Select the appropriate version upgrade from the CLI prompt
- Once a new version has been selected, the following happens:
  - All packages' versions are updated
  - A new tag, `v<version>`, is created locally
- Update `CHANGELOG.md` with the changes since last update
- Commit the code changes with a message like `Update version to v<version>`
- Commit the newly created tag `git push --tags`
  - This will trigger a npm publication and a website deployment
