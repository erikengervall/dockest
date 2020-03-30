#!/bin/bash
set -euxo pipefail

source "$HOME/.profile"
cat $HOME/.profile
nvm use default

# start docker daemon
nohup dockerd --host=unix:///var/run/docker.sock --host=tcp://127.0.0.1:2375&

DOCKER_HOST=tcp://127.0.0.1:2375
# wait until daemon is ready :)
timeout 15 sh -c "until docker info; do echo .; sleep 1; done"

cd /usr/app

yarn install --no-lockfile

docker-compose -f docker-compose.yml build
yarn test:docker-in-docker
