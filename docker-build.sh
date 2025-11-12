#!/usr/bin/env bash

set -e

npm install
npm run build

docker build -t host-docker-internal:latest .
