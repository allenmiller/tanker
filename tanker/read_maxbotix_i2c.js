//i2cset -y 1 0x70 0x51 && sleep 1 && i2cget -y 1 0x70 0xE1 w

const i2c = require('i2c-bus')
const request = require('request');

const I2C_BUS                  = 1
const MAXBOTIX_BUS_ADDR        = 0x70
const MAXBOTIX_WAIT_TIME_MS    = 100
const MEASURE_RANGE_COMMAND    = 0x51
const READ_MEASUREMENT_ADDRESS = 0xE1
const SENSOR_LEVEL             = 33;  // cm below ground level
const SENSOR_NAME              = "MAXBOTIX_7040_100"
const SENSOR_OFFSET            = 0;   // constant error in sensor position.

const POST_URL = 'https://rmecu0chj5.execute-api.us-east-1.amazonaws.com/prod/tanker'

const date = new Date()

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

function buildRecord(distance) {
    let record = {};
    record.sensor = SENSOR_NAME;
    record.sensorLevel = SENSOR_LEVEL;
    record.distance_cm = distance + SENSOR_OFFSET;
    record.time = date.getTime();
    return record
}

function postResult(distance) {
    record = buildRecord(distance)
    console.log("Posting ", record);
    return
    request.post({
      url: POST_URL,
      json: true,
      body: record
    }, function (error, response, body) {
      if (error) {
        console.log("ERROR posting record");
        console.log(response);
        console.log(body);
        console.log("attempting to save locally");
        fs.appendFile('levels.js', body, (err) => {
          "use strict";
          if (err) throw err;
          console.log("Saved locally")
        });
        throw error;
      }
    });
  };

getDistance()
    .then(distance => { postResult(distance) })
    .catch(err => { console.log(err) })
