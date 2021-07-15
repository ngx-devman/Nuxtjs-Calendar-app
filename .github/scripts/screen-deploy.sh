#!/usr/bin/env bash
echo "closing screen session..."
screen -S clublisi -X quit

echo "opening new screen session..."
screen -d -m -S clublisi yarn start
