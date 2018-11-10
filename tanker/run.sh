#!/bin/sh

while [ 1 ] ; do
    node read_tank_level-lidar.js 40
    sleep 300
done
