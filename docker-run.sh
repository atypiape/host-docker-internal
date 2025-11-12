#!/usr/bin/env bash

set -e

docker run -id \
  -p 3000:3000 \
  --name host-docker-internal \
  host-docker-internal:latest
