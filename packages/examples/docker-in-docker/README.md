# Docker in Docker Example

## Motivation

This example will run a docker daemon inside a docker container and run some Dockest tests on containers started with
that daemon.

Should you do this? Probably not. You can read more here:
https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/

Some environments (such as AWS Codebuild) will however require using this method, as they do not provide a way of
injecting the host docker socket into the build container.

## How can I use this example?

```bash
./prepare.sh
./run.sh
```
