//i2cset -y 1 0x70 0x51 && sleep 1 && i2cget -y 1 0x70 0xE1 w
console.log("Starting")

const Gpio = require('onoff').Gpio;
const i2c = require('i2c-bus')
const request = require('request');

const MINS_15_MS               = 900000;
const SECS_5_MS                = 5000;

const I2C_BUS                  = 1;
const MAXBOTIX_BUS_ADDR        = 0x70;
const MAXBOTIX_WAIT_TIME_MS    = 100;
const MEASURE_RANGE_COMMAND    = 0x51;
const READ_MEASUREMENT_ADDRESS = 0xE1;
const SENSOR_LEVEL             = 33;  // cm below ground level
const SENSOR_NAME              = "MB_7040_100";
const SENSOR_OFFSET            = 0;   // constant error in sensor position.
const SEPTIC_PUMP_PIN          = 4;
const SANDFILTER_PUMP_PIN      = 17;

const POST_URL = 'https://rmecu0chj5.execute-api.us-east-1.amazonaws.com/prod/tanker';

let readTankLevelInterval;
let septicPumpInterval;
let sandFilterPumpInterval;

function swapBytes(word) {
    return ((word & 0xff00) >> 8) | ((word & 0xff) << 8);
}

async function delay(ms) {
    return new Promise(resolve => { setTimeout(resolve, ms); });
}

async function getDistance(i2cBus) {
    i2cBus.writeByteSync(MAXBOTIX_BUS_ADDR, 0, MEASURE_RANGE_COMMAND)
    await delay(MAXBOTIX_WAIT_TIME_MS)
    const rawData = i2cBus.readWordSync(MAXBOTIX_BUS_ADDR, READ_MEASUREMENT_ADDRESS);
    return swapBytes(rawData)
}

function readTankLevel(i2cBus) {
    getDistance(i2cBus)
	.then(distance => { postResult(distance) })
	.catch(err => { console.log(err) })
}

function buildLevelRecord(distance) {
    let record = {};
    record.sensor = SENSOR_NAME;
    record.sensorLevel = SENSOR_LEVEL;
    record.distance_cm = distance + SENSOR_OFFSET;
    record.time = (new Date()).getTime();
    return record
}

function postResult(distance) {
    record = buildLevelRecord(distance)
    console.log("Posting ", record);
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
          // throw error;
      }
    });
  };

function readPumpStatus(tankName, GpioPin) {
    const sensor = new Gpio(GpioPin, 'in');
    pumpState = sensor.readSync();
    console.log("%s: %s", tankName, pumpState)
}

process.on("SIGTERM", () => {
    console.log("Shutting down");
    clearInterval(readTankLevelInterval);
    clearInterval(septicPumpInterval);
    clearInterval(sandFilterPumpInterval);
    i2cBus.closeSync();
    console.log("Cleared intervals and closed i2c bus")
})

let i2cBus = i2c.openSync(I2C_BUS);
readTankLevel(i2cBus);
readPumpStatus("SEPTIC-PUMP", SEPTIC_PUMP_PIN);
readPumpStatus("SANDFILTER-PUMP", SANDFILTER_PUMP_PIN);
readTankLevelInterval = setInterval(readTankLevel, MINS_15_MS, i2cBus);
septicPumpInterval = setInterval(readPumpStatus, SECS_5_MS, "SEPTIC-PUMP", SEPTIC_PUMP_PIN)
sandFilterPumpInterval = setInterval(readPumpStatus, SECS_5_MS, "SANDFILTER-PUMP", SANDFILTER_PUMP_PIN)
