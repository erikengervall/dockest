#!/bin/bash
set -euxo pipefail

echo "Run dockest as usual"
yarn test:codebuild:buildspec

echo "Build docker image"
docker build --file CI.Dockerfile -t aws-codebuild-ci-node .

echo "Run dockest inside the codebuild container"
./codebuild_build.sh -i aws-codebuild-ci-node -a .artifacts
