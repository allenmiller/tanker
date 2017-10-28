#!/bin/sh

while [ 1 ] ; do

    iwlist wlan0 scan | grep -q perseus
    online=$?
    date
    if [ ${online} -eq 0 ] ; then
	echo "we are online"
    else
	echo "OFFLINE"
	iwlist wlan0 scan
    fi

    sleep 300
done
