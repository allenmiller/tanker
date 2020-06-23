#Set up Raspberry Pi
https://www.raspberrypi.org/documentation/configuration/wireless/headless.md
## Install Raspbian

Download and Install the Raspberry Pi Imager (currently v1.3)
Insert blank micro-SD card
Run RPI Imager
Select "Raspberry Pi OS Desktop (32-bit)"
Choose SD card
Click "Write"

## Configure Wifi access

  cd /Volumes/boot

  create file wpa_supplicant.conf containing:

  ````
  ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
  update_config=1
  country=US
  network={
    ssid="MYSSID"
    psk="MYPASSWD"
  }
  ````

Read the notes at the end of:
https://howchoo.com/g/ndy1zte2yjn/how-to-set-up-wifi-on-your-raspberry-pi-without-ethernet

  enable ssh:

  ````

  touch ssh
  cd

  ````
  Unmount/eject /Volumes/boot

  remove microSD card from mac, insert in Raspberry Pi, power up.
  May need to port scan to find IP address
````
  sudo nmap -sP 10.0.0.0/24
  
  Starting Nmap 7.40 ( https://nmap.org ) at 2017-09-07 20:42 PDT
  Nmap scan report for 10.0.0.1
  Host is up (0.014s latency).
  MAC Address: CC:03:FA:7A:5B:23 (Technicolor CH USA)
...
  Nmap scan report for 10.0.0.8
  Host is up (0.015s latency).
  MAC Address: B8:27:EB:39:F7:33 (Raspberry Pi Foundation)
...
  Nmap done: 256 IP addresses (10 hosts up) scanned in 5.29 seconds
  
  ssh pi@<IP> password raspberry
  passwd # change default password immediately
````
Lock down password-based logins and evaluate other security considerations
````
sudo visudo
````
%sudo   ALL=(ALL:ALL) NOPASSWD: ALL
````
Add user tanker
````
sudo adduser tanker
sudo usermod -a -G adm,sudo,plugdev,users,input,netdev,gpio,i2c,spi tanker
sudo -u tanker bash
cd ~tanker
  mkdir .ssh
  chmod 755 .ssh
  cd .ssh
  nano authorized_keys
    <copy your public key>
  chmod 644 authorized_keys
exit
exit
ssh tanker@<ip>
sudo pkill -u pi # why are there still pi processes?
sudo deluser -remove-home pi
sudo apt install emacs-nox
sudo apt install tmux
sudo emacs /etc/ssh/sshd_config
There are three lines that need to be changed to no, if they are not set that way already:

ChallengeResponseAuthentication no
PasswordAuthentication no
UsePAM no
sudo service ssh reload

https://www.raspberrypi.org/documentation/configuration/security.md


Give it a hostname and change the default password:
````
  sudo hostname tortoise
  sudo vi /etc/hosts
   < add hostname (tortoise in this case) to the first line, after localhost >
````

Update OS to latest versions

````
  sudo apt update
  sudo apt full-upgrade
  sudo apt install emacs-nox
````
raspi-config enable I2C driver, set time zone.


Update node.js.  Need to pay attention to processor architecture 'uname -m'
````

curl -L https://git.io/n-install | bash

- or -


https://stackoverflow.com/questions/42741243/how-do-you-install-newest-version-of-node-js-on-raspberry-pi
install latest appropriate node.js https://nodejs.org
wget https://nodejs.org/dist/v12.18.1/node-v12.18.1-linux-armv7l.tar.xz # RPI 3: ARM 7 - 64 bit
wget https://nodejs.org/download/release/latest-v10.x/node-v10.21.0-linux-armv6l.tar.xz  # RPI Zero: ARM 6 - 32 bit

tar Jxvf node-v12.18.1-linux-armv7l.tar.xz
cd node-v6.11.1-linux-armv6l/
sudo cp -R * /usr/local/

https://github.com/nodejs/help/wiki/Installation



pi@tortoise:~ $ . /home/pi/.bashrc
pi@tortoise:~ $ node -v
v8.4.0
pi@tortoise:~ $ npm --version
5.3.0
 
````
download tanker source
````
mkdir -p git/github.com/allenmiller
cd $_
````
Generate SSH key pair, upload public key to github
Add following to ~/.ssh/config
````
host github.com
  Hostname github.com
  IdentityFile ~/.ssh/tanker
  User gi
````
Configure and clone the repo
````
git config --global pull.rebase true
git clone git@github.com:allenmiller/tanker.git
cd tanker/tanker
npm install

````
Configure gpio ports for Pump monitor

gpio mode 24 in # Sand filter pump, physical pin 35
gpio mode 25 in # Septic tank pump, physical pin 37

Install tanker
sudo cp tanker.service /lib/systemd/system/
sudo systemctl enable tanker
sudo systemctl start tanker


npm install tanker  # someday

i2c clock stretching bug:
````
https://github.com/fivdi/i2c-bus/issues/36

The default baudrate on the raspberry Pi is 100000. It can be lowered to 10000 by adding the following line to /boot/config.txt and rebooting the Pi.  Maxbotix suggests a max baudrate of 50000

dtparam=i2c_baudrate=10000

````

Raspberry Pi watchdog reset
````
https://raspberrypi.stackexchange.com/questions/1401/how-do-i-hard-reset-a-raspberry-pi
````

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
Cap/Height  22 gal/in 8.67 gal/cm  30.6 l/cm

Volume consumed at lower limit: 564 gal
Volume consumed at normal high: 702 gal
Volume consumed at alarm level: 971 gal
````

Lidar detector calibration

Distance measured from bottom of enclosure in which LIDAR is mounted
````
Measured          Reported
54                  37 +/- 2
84                  64
112                 93
202                187
248                238
````
S3 -- Create new bucket tanker.ajmiller.net
Enable web hosting
S3 Bucket Policy
````
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AddPerm",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::tanker.ajmiller.net/*"
        }
    ]
}
````
Default CORS configuration works.
