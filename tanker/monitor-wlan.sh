#!/bin/sh

while [ 1 ] ; do

    iwlist wlan0 scan
    iwlist wlan0 scan | grep -q perseus
    online=$?
    date
    if [ ${online} -eq 0 ] ; then
	echo "online"
    else
	echo "OFFLINE, restarting networking"
	dmesg
	ip a
	iwlist wlan0 scan
	service --status-all
	echo executing ifconfig
	# sudo ifconfig wlan0 up
	sudo shutdown -r now
	# sleep 60
	# ip a
 	# sudo systemctl restart networking.service
    fi

    sleep 300
done
