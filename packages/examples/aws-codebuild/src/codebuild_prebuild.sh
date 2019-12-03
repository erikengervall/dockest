#!/bin/bash

cd ../../../dockest
yarn pack --filename ../examples/aws-codebuild/src/dockest.tgz
cd ../examples/aws-codebuild/src

yarn cache clean
yarn install --no-lockfile