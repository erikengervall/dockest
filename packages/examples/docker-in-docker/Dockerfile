FROM node:12

ARG DOCKER_COMPOSE_VERSION="1.25.4"
ARG DOCKER_BUILDX_VERSION="v0.3.1"

RUN apt-get update \
    && apt-get install -y curl bash apt-transport-https ca-certificates software-properties-common gnupg2

# Install Docker
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y  docker-ce docker-ce-cli containerd.io

# Install Buildx for fast docker builds
RUN mkdir -p  ~/.docker/cli-plugins \
    && curl -fsSL "https://github.com/docker/buildx/releases/download/$DOCKER_BUILDX_VERSION/buildx-$DOCKER_BUILDX_VERSION.linux-amd64" --output ~/.docker/cli-plugins/docker-buildx \
    && chmod a+x ~/.docker/cli-plugins/docker-buildx

# Install docker-compose
RUN curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

WORKDIR /usr/app

COPY src/ .

ENTRYPOINT ["/usr/app/run-test.sh"]
