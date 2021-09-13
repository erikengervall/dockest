# Release process

Release process towards npm

## Prep

- Decide on a version. Let's reference it as `<VERSION>`
  - e.g. `v1.0.0`, append `-alpha.0` or `-beta.0` to inform the CI to publish the package to npm as such (i.e. **not**
    as "latest")
- Create release branch `git checkout -b "release-v<VERSION>"`
- Make sure `CHANGELOG.md` contains the changes for the upcoming version

## Creating a new version

- Be in release branch
- Make sure all changes are pushed to remote
- Run `yarn lerna version <VERSION>` (e.g. `yarn lerna version v3.0.0-beta.0`) from project root, this will:
  - Bump all packages configured with Lerna
  - Create a git tag
  - Push changes and tags (`git push --tags` to include tags)

From here, the pipeline will publish the library's new version to npm and redeploy the website

## Clean up

- Merge release branch into master
- Delete release branch
