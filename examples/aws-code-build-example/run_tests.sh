#!/bin/bash
set -euxo pipefail

cd ../..
yarn build
yarn pack --filename examples/aws-code-build-example/dockest.tgz
cd examples/aws-code-build-example

# build dockest
# yarn install
# yarn test

# build with dockest inside docker container
./codebuild_build.sh -i n1ru4l/aws-codebuild-node -a .artifacts
