#!/bin/sh

while [ 1 ] ; do
    node /home/pi/git/github.com/allenmiller/tanker-backend/tanker/read_tank_level-lidar.js 40
    sleep 300
done
