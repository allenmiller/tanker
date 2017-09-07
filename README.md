#Set up Raspberry Pi

## Install Raspbian
  https://howchoo.com/g/ndy1zte2yjn/how-to-set-up-wifi-on-your-raspberry-pi-without-ethernet
  https://www.raspberrypi.org/forums/viewtopic.php?t=74176
  
https://davidmaitland.me/2015/12/raspberry-pi-zero-headless-setup/

  Download latest
  unzip 2017-08-16-raspbian-stretch.zip
  Load microSD card into USB adapter and plug into the mac

  Unmount the microSD volume
  sudo diskutil unmount /dev/disk2s1
  sudo dd bs=1m if=2017-08-16-raspbian-stretch.img of=/dev/rdisk2
4680+1 records in
4680+1 records out
4907675648 bytes transferred in 407.905175 secs (12031413 bytes/sec)
  

  cd /Volumes/boot

  create file wpa_supplicant.conf containing:

  ````
  network={
    ssid="MYSSID"
    psk="MYPASSWD"
    key_mgmt=WPA-PSK
  }
  ````

Read the notes at the end of:
https://howchoo.com/g/ndy1zte2yjn/how-to-set-up-wifi-on-your-raspberry-pi-without-ethernet

  enable ssh:

  touch ssh
  cd
  sudo diskutil unmount /dev/disk2s1

  remove microSD card from mac, insert in Raspberry Pi, power up.



=


Backend web server and database manager for Tanker

````
Measurements:

Relative to ground

top of tank     62
alarm level     90
alert level    106
normal high    121
lower limit    137
bottom of tank 202
````

Pump Tank characteristics
````
Capacity     1150 gal   4353 l
Height         55  in    140 cm
Cap/Height  21 gal/in 8.2 gal/cm  31.1 l/cm

Volume consumed at lower limit: 533 gal
Volume consumed at alarm level: 918 gal
````