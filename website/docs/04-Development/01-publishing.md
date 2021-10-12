---
id: publishing
title: Publishing
sidebar_label: Publishing
---

## Publishing a new version

- Run `yarn lerna version --no-push --no-git-tag-version` from root
  - Select the appropriate version upgrade from the CLI prompt
- Update `CHANGELOG.md` with the changes since last update
- Commit & push the code changes with a message like `Update version to v<VERSION>`
- Create new tag `git tag v<VERSION>` (examples: `v3.0.1`, `v3.0.0-beta.2`)
- Push the newly created tag `git push --tags`
  - This will trigger a npm publication and a website deployment
