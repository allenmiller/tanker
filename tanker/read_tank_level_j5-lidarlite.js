let Raspi = require('raspi-io');
let five = require("johnny-five");
let board = new five.Board({io: new Raspi()});

board.on("ready", function() {
    var proximity = new five.Proximity({
	controller: "LIDARLITE"
    });

    proximity.on("data", function() {
	console.log("Proximity: ");
	console.log("  cm  : ", this.cm);
	console.log("  in  : ", this.in);
	console.log("-----------------");
    });

    proximity.on("change", function() {
	console.log(this.cm + "cm");
    });
});
