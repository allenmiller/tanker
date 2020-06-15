//i2cset -y 1 0x70 0x51 && sleep 1 && i2cget -y 1 0x70 0xE1 w

const i2c = require('i2c-bus');

const I2C_BUS                  = 1
const MAXBOTIX_BUS_ADDR        = 0x70
const MAXBOTIX_WAIT_TIME_MS    = 100
const MEASURE_RANGE_COMMAND    = 0x51
const READ_MEASUREMENT_ADDRESS = 0xE1

function swapBytes(word) {
    return ((word >> 8) & 0xff) | ((word & 0xff) << 8);
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getDistance() {
    const i2cBus = i2c.openSync(I2C_BUS);
    i2cBus.writeByteSync(MAXBOTIX_BUS_ADDR, 0, MEASURE_RANGE_COMMAND)
    await delay(MAXBOTIX_WAIT_TIME_MS)
    const rawData = i2cBus.readWordSync(MAXBOTIX_BUS_ADDR, READ_MEASUREMENT_ADDRESS);
    i2cBus.closeSync();
    return swapBytes(rawData)
}

function postDistance(distance) {
    console.log(distance)
}

getDistance()
    .then(distance => { postDistance(distance) })
    .catch(err => { console.log(err) })
