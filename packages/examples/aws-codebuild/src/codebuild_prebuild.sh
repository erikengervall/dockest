#!/bin/bash

cd ../../../dockest
yarn pack --filename ../examples/aws-codebuild/src/dockest.tgz
cd ../examples/aws-codebuild/src

yarn cache clean dockest
yarn install --no-lockfile