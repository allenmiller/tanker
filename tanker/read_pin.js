
var gpio = require('./rpi-gpio');

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


function readInput(err) {
    console.log("AJM: in readInpjut")
    if (err) throw err;
    gpio.read(PIN, function(err, value) {
	console.log("AJM: in callback")
        if (err) throw err;
        console.log('The value is ' + value);
    });
    console.log("after read");
}

console.log("AJM: calling gpio.setup()")
gpio.setup(PIN, gpio.DIR_IN, readInput);
console.log("at end");
