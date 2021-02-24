FROM node:14-slim

LABEL author="Laurin Quast <laurinquast@googlemail.com>"

ENV DOCKER_COMPOSE_VERSION="1.27.4"
ENV DOCKER_BUILD_X_VERSION="0.4.2"

RUN apt-get update \
    && apt-get install -y python3 curl bash apt-transport-https ca-certificates software-properties-common gnupg2 jq \
    && curl https://bootstrap.pypa.io/3.5/get-pip.py -o get-pip.py \
    && python3 get-pip.py \
    && rm get-pip.py \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y  docker-ce docker-ce-cli containerd.io \
    \
    && pip install "docker-compose==$DOCKER_COMPOSE_VERSION" \
    && docker-compose version \
    \
    && mkdir -p  ~/.docker/cli-plugins \
    && curl -fsSL "https://github.com/docker/buildx/releases/download/v$DOCKER_BUILD_X_VERSION/buildx-v$DOCKER_BUILD_X_VERSION.linux-amd64" --output ~/.docker/cli-plugins/docker-buildx \
    && chmod a+x ~/.docker/cli-plugins/docker-buildx && \
    echo "done."
