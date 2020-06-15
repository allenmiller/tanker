//i2cset -y 1 0x70 0x51 && sleep 1 && i2cget -y 1 0x70 0xE1 w

const i2c = require('i2c-bus');

const MAXBOTIX_BUS_ADDR = 0x70 // 224
const MAXBOTIX_READ_ADDR  = 0x70 // 225
const MEASURE_RANGE_COMMAND  = 0x51
const READ_MEASUREMENT_ADDRESS = 0xE1

async function getDistance() {
    const i2c1 = i2c.openSync(1);
    let bus = i2c1.writeByteSync(MAXBOTIX_BUS_ADDR, 0, MEASURE_RANGE_COMMAND)
    let start = Date.now()
    console.log("sleeping: ", start)
    await new Promise(resolve => setTimeout(resolve, 100));
    let end = Date.now()
    console.log("awake: ", end - start)
    const rawData = i2c1.readWordSync(MAXBOTIX_BUS_ADDR, READ_MEASUREMENT_ADDRESS);
    console.log(rawData.toString(16));
    swapped = ((rawData >> 8) & 0xff) | ((rawData & 0xff) << 8);
    console.log( swapped.toString(16));
    console.log(swapped, " cm")
    i2c1.closeSync();
    return swapped
}

getDistance()
    .then(distance => { console.log(distance, "cm") })
    .catch(err => { console.log(err) })
