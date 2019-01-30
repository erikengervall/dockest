#!/bin/bash -e

testCommand="$1"
extraArgs="$2"

source .env.test

# Detect when it is running in kubernetes containers and use the ip command instead
if [ ! -f "/sbin/ifconfig" ]; then
  HOST_IP=$(ip addr | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1 | awk -F '/' '{ print $1 }')
else
  HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
fi
export HOST_IP

wait_for_kafka() {
  while [ 200 -ne $(curl -s -o /dev/null -w "%{http_code}" http://localhost:9082) ]; do sleep 1; done
}

find_kafka_container_id() {
  echo $(docker ps \
    --filter "status=running" \
    --filter "label=klarna.project=logistics-tracking-api" \
    --filter "label=com.docker.compose.service=kafka" \
    --no-trunc \
    -q)
}

start_kafka_container() {
  echo -e "Start kafka docker container"
  docker-compose run -d --label klarna.project=logistics-tracking-api -p 9092:9092 -p 9093:9093 -p 9094:9094 -p 9082:8081 -p 2181:2181 -e kafka_hostname="" -e kafka_advertised_hostname=${HOST_IP} -e kafka_auto_create_topics_enable=true kafka 

  if [ "1" = "$?" ]; then
    echo -e "Failed to start kafka image"
    exit 1
  fi

  KAFKA_CONTAINER_ID=$(find_kafka_container_id)
  STARTED_KAFKA_CONTAINER=1
}

quit() {
  if [ ! -z ${KAFKA_CONTAINER_ID} ]; then
    echo -e "Stopping kafka docker container"
    docker-compose down --remove-orphans
  fi
  exit 1
}

trap quit ERR

STARTED_KAFKA_CONTAINER=0

if [ -z ${KAFKA_CONTAINER_ID} ]; then
  start_kafka_container
fi

wait_for_kafka
echo -e "Kafka container ${KAFKA_CONTAINER_ID} is running"

NODE_ENV=test
eval "${testCommand} ${extraArgs}"
TEST_EXIT=$?

if [ $STARTED_KAFKA_CONTAINER -eq 1 ]; then
  echo "Stopping Kafka container..."
  docker stop ${KAFKA_CONTAINER_ID}
  echo "Kafka container stopped. Going to remove it..."
  docker rm ${KAFKA_CONTAINER_ID}
fi

echo "all done"
exit ${TEST_EXIT}
