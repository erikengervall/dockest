#!/bin/bash
set -euxo pipefail

cd ../../dockest
yarn pack --filename ../examples/docker-in-docker/src/dockest.tgz
cd ../examples/docker-in-docker/src

yarn cache clean
yarn install --no-lockfile
