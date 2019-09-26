#!/bin/bash
set -euxo pipefail

cd ../..
yarn build
yarn pack --filename examples/aws-code-build-example/dockest.tgz
cd examples/aws-code-build-example

# build dockest
yarn cache clean
yarn install --no-lockfile
yarn test

# build with dockest inside docker container
rm -rf node_modules
./codebuild_build.sh -i n1ru4l/aws-codebuild-node -a .artifacts
