#!/usr/bin/env bash
echo "building application"
echo "removing old build files (.nuxt, dist, node_modules)"
rm -rf .nuxt dist node_modules

echo "running install, build, generate"
yarn install && yarn build && yarn generate
