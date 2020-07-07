const Gpio = require('onoff').Gpio;

process.argv.forEach(function (val, index) {
  console.log(index + ': ' + val);
});

if (process.argv.length !== 5) {
  console.log('usage: node read_pump_status {TANK} {PIN} {SLEEP}');
  process.exit(1);
}

const TANK = process.argv[2];
const PIN = parseInt(process.argv[3]);
const SLEEP = parseInt(process.argv[4]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const sensor = new Gpio(PIN, 'in');


console.log(sensor.readSync())
