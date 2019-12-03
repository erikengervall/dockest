#!/bin/bash
set -euxo pipefail

echo "Run dockest as usual"
yarn test:codebuild:buildspec

# image source: https://github.com/n1ru4l/docker-image-node-10-with-docker-and-compose
echo "Run dockest inside the codebuild container"
./codebuild_build.sh -i n1ru4l/aws-codebuild-node:7712cfae8d65fd3b704f74e84f688739de5bd357 -a .artifacts
