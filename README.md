# Set up Raspberry Pi

<https://www.raspberrypi.org/documentation/configuration/wireless/headless.md>

## Install Raspbian

1. Download and Install the Raspberry Pi Imager (currently v1.6)
2. Insert blank micro-SD card
3. Run RPI Imager
4. Select "Raspberry Pi OS Desktop (32-bit)"
5. Choose SD card
6. Click "Write"

## Configure Wifi access

  cd /Volumes/boot

  create file wpa_supplicant.conf containing:

  ```text
  ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
  update_config=1
  country=US
  network={
    ssid="MYSSID"
    psk="MYPASSWD"
  }
  ```

Read the notes at the end of:
<https://howchoo.com/g/ndy1zte2yjn/how-to-set-up-wifi-on-your-raspberry-pi-without-ethernet>

  enable ssh:

  ```bash

  touch ssh
  cd

  ```

  Unmount/eject /Volumes/boot

  remove microSD card from mac, insert in Raspberry Pi, power up.
  May need to port scan to find IP address

```bash
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
```

Lock down password-based logins and evaluate other security considerations

```bash
sudo visudo
```

%sudo   ALL=(ALL:ALL) NOPASSWD: ALL

Add user tanker

```bash
sudo apt install emacs-nox tmux wiringpi
sudo adduser tanker
sudo usermod -a -G adm,sudo,plugdev,users,input,netdev,gpio,i2c,spi tanker
sudo -u tanker bash
cd ~tanker
mkdir .ssh
chmod 755 .ssh
cd .ssh
emacs authorized_keys
  <copy your public key>
chmod 644 authorized_keys
exit
```

```bash
ssh tanker@<ip>
<Use raspi-config -> Boot Options -> Console to disable auto login of pi user.>
sudo pkill -u pi
sudo deluser -remove-home pi
sudo apt update
sudo apt full-upgrade
sudo emacs /etc/ssh/sshd_config
```

There are three lines that need to be changed to no, if they are not set that way already:

```text
ChallengeResponseAuthentication no
PasswordAuthentication no
UsePAM no
```

```bash
sudo service ssh reload
```

https://www.raspberrypi.org/documentation/configuration/security.md


Give it a hostname and change the default password:

````bash

  sudo hostname tortoise
  sudo vi /etc/hosts
   < add hostname (tortoise in this case) to the first line, after localhost >

````

raspi-config enable I2C driver, and set time zone.

Update node.js.  Need to pay attention to processor architecture 'uname -m'
````

curl -L <https://git.io/n-install> | bash

tanker@tortoise:~ $ node -v
v10.24.1
tanker@tortoise:~ $ npm --version
6.14.12
````

download tanker source

````bash
mkdir -p git/github.com/allenmiller
cd $_
````

Generate SSH key pair, upload public key to github
Add following to ~/.ssh/config

````text
host github.com
  Hostname github.com
  IdentityFile ~/.ssh/<private key file name>
  User git
````

Configure and clone the repo

````bash
git config --global pull.rebase true
git config --global user.email al.miller@ajmiller.net
git config --global user.name "Allen Miller"
git clone git@github.com:allenmiller/tanker.git
cd tanker/tanker
npm install
````

If "Could not find the bindings file."
Try; npm install node-gyp -- didn't happen in feb 2022

Configure gpio ports for Pump monitor

```bash
#NB: gpio command has been deprecated
gpio mode 24 in # Sand filter pump, physical pin 35
gpio mode 25 in # Septic tank pump, physical pin 37

# see https://raspberry-projects.com/pi/command-line/io-pins-command-line/io-pin-control-from-the-command-line

echo "24" > /sys/class/gpio/export
echo "in" > /sys/class/gpio/gpio24/direction

echo "25" > /sys/class/gpio/export
echo "in" > /sys/class/gpio/gpio25/direction
```

Install tanker

```bash
sudo cp tanker.service /lib/systemd/system/
sudo systemctl enable tanker
sudo systemctl start tanker
```

npm install tanker  # someday

i2c clock stretching bug:
````
<https://github.com/fivdi/i2c-bus/issues/36>

The default baudrate on the raspberry Pi is 100000. It can be lowered to 10000 by adding the following line to /boot/config.txt and rebooting the Pi.  Maxbotix suggests a max baudrate of 50000

dtparam=i2c_baudrate=10000

````

DHCPD IPV6 error messages in /var/log/daemon.log. See https://forums.raspberrypi.com/viewtopic.php?p=1963265.   Add:

```text
interface wlan0
noipv6
```

to /etc/dhcpcd.conf, then

```bash
sudo dhcpcd --rebind wlan0
```

Raspberry Pi watchdog reset
````
<https://raspberrypi.stackexchange.com/questions/1401/how-do-i-hard-reset-a-raspberry-pi>

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
