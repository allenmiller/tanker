var gpio = require('rpi-gpio');

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});

console.log("calling setup");
gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);
