FROM docker:19.03.8-dind

ARG DOCKER_COMPOSE_VERSION="1.27.4"
ARG DOCKER_BUILDX_VERSION="v0.4.2"
ARG NODE_JS_VERSION="12.18.4"
ARG YARN_VERSION="1.22.10"

RUN apk add --no-cache curl bash

# Install Buildx for fast docker builds
RUN mkdir -p  ~/.docker/cli-plugins \
    && curl -fsSL "https://github.com/docker/buildx/releases/download/$DOCKER_BUILDX_VERSION/buildx-$DOCKER_BUILDX_VERSION.linux-amd64" --output ~/.docker/cli-plugins/docker-buildx \
    && chmod a+x ~/.docker/cli-plugins/docker-buildx

# install docker-compsoe
# source https://github.com/wernight/docker-compose/blob/master/Dockerfile
RUN set -x && \
    apk add --no-cache -t .deps ca-certificates && \
    # Install glibc on Alpine (required by docker-compose) from
    # https://github.com/sgerrand/alpine-pkg-glibc
    # See also https://github.com/gliderlabs/docker-alpine/issues/11
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk && \
    apk add glibc-2.29-r0.apk && \
    rm glibc-2.29-r0.apk && \
    apk del --purge .deps

ENV LD_LIBRARY_PATH=/lib:/usr/lib

RUN set -x && \
    apk add --no-cache -t .deps ca-certificates && \
    # Required dependencies.
    apk add --no-cache zlib libgcc && \
    wget -q -O /usr/local/bin/docker-compose https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-Linux-x86_64 && \
    chmod a+rx /usr/local/bin/docker-compose && \
    \
    # Clean-up
    apk del --purge .deps && \
    \
    # Basic check it works
    docker-compose version

# source: https://github.com/nvm-sh/nvm/issues/1102#issuecomment-591560924
RUN apk add --no-cache libstdc++; \
    touch "$HOME/.profile"; \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash; \
    echo 'source $HOME/.profile;' >> $HOME/.zshrc; \
    echo 'export NVM_NODEJS_ORG_MIRROR=https://unofficial-builds.nodejs.org/download/release;' >> $HOME/.profile; \
    echo 'nvm_get_arch() { nvm_echo "x64-musl"; }' >> $HOME/.profile; \
    NVM_DIR="$HOME/.nvm"; source $HOME/.nvm/nvm.sh; source $HOME/.profile; \
    nvm install $NODE_JS_VERSION; \
    npm install -g "yarn@$YARN_VERSION"

WORKDIR /usr/app

COPY src/ .

CMD ["/usr/app/run-test.sh"]
