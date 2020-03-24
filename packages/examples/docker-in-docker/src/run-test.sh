#!/bin/bash
set -euxo pipefail

# start docker daemon
nohup /usr/bin/dockerd --storage-driver=devicemapper --data-root /tmp/docker --host=unix:///var/run/docker.sock --host=tcp://127.0.0.1:2375&

# wait until daemon is ready :)
timeout 15 sh -c "until docker info; do echo .; sleep 1; done"

cd /usr/app

yarn install --no-lockfile
yarn test:docker-in-docker
