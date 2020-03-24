#!/bin/bash
set -euxo pipefail

# build a container with node, docker and docker-compose
docker build . -t dockest-did-test

# run our container which will run the tests
# without privileged access the docker ddaemon inside the container can't start.
docker run --privileged dockest-did-test
