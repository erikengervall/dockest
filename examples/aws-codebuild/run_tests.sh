#!/bin/bash
set -euxo pipefail

cd ../..
yarn build
yarn pack --filename examples/aws-codebuild/dockest.tgz
cd examples/aws-codebuild

# build dockest
yarn cache clean
yarn install --no-lockfile
#yarn test

# build with dockest inside docker container
yarn clean:node_modules
./codebuild_build.sh -i n1ru4l/aws-codebuild-node:7712cfae8d65fd3b704f74e84f688739de5bd357 -a .artifacts
