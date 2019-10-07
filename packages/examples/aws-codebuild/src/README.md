# aws-codebuild

Example that showcases usage with AWS Codebuild.

It can be reused for any CI System that runs your build inside a docker container with an injected docker socket.

## Running the build

```bash
./run_tests.sh
```

This test should also pass when not being run inside a container.

## Differences to running dockest on the host

- Dockest creates a network that connects the container that runs dockest to the other containers
- Dockest uses the target ports on the containers (instead of the published on the host)
- Services can be accessed via their service name as the hostname

# Development

Dockest must be bundeled as a .tgz and put inside this folder, because the codebuild container cannot resolve the parent directories (check `run_tests.sh`).

# Exposed ports

- Node
  - 9000
