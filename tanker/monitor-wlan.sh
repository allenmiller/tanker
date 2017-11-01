#!/bin/sh

while [ 1 ] ; do

    iwlist wlan0 scan | grep -q perseus
    online=$?
    date
    if [ ${online} -eq 0 ] ; then
	echo "online"
    else
	echo "OFFLINE, restarting networking"
	iwlist wlan0 scan
 	sudo systemctl restart networking.service
    fi

    sleep 300
done
