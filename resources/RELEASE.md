# Release process

Release process towards npm

## Preperation

- Decide on a version. Let's reference it as `{VERSION}`
- Create release branch `git checkout -b "release-v{VERSION}"`
- Make sure CHANGELOG.md contains the changes for the upcoming version

## Creating a new version

- Make sure all changes are pushed to remote
- Run `yarn lerna version {VERSION}` from project root, this will:
  - bump all packages configured with Lerna
  - create a git tag
  - push changes and tags

From here, the pipeline will publish the library to npm and deploy a new version of the website

## Clean up

- Merge release branch into master
- Delete release branch
