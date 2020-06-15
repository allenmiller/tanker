# i2cset -y 1 0x70 0x51 && sleep 1 && i2cget -y 1 0x70 0xE1 w

from smbus import SMBus
from time import sleep

try:
    i2cbus = SMBus(1)
    i2cbus.write_byte(0x70, 0x51)
    sleep(0.12)
    val = i2cbus.read_word_data(0x70, 0xe1)
    print ((val >> 8) & 0xff) | ((val & 0xff) << 8), 'cm'
except IOError, err:
    print err
