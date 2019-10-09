#!/bin/bash
set -euxo pipefail

cd ../../../dockest
yarn pack --filename ../examples/aws-codebuild/src/dockest.tgz
cd ../examples/aws-codebuild/src

# build dockest
yarn cache clean
yarn install --no-lockfile
yarn test

# build with dockest inside docker container
# image source: https://github.com/n1ru4l/docker-image-node-10-with-docker-and-compose
./codebuild_build.sh -i n1ru4l/aws-codebuild-node:7712cfae8d65fd3b704f74e84f688739de5bd357 -a .artifacts
