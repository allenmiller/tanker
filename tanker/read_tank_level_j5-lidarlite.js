let Raspi = require('raspi-io');
let five = require("johnny-five");
let board = new five.Board({
  io: new Raspi(),
  repl: false,
  debug: false
});

board.on("message", function(event) {
  /*
    Event {
      type: "info"|"warn"|"fail",
      timestamp: Time of event in milliseconds,
      class: name of relevant component class,
      message: message [+ ...detail]
    }
  */
  console.log("Received a %s message, from %s, reporting: %s", event.type, event.class, event.message);
});

board.on("ready", function () {
  console.log("board is ready");
  let proximity = new five.Proximity({
    controller: "LIDARLITE",
    freq: 10000 // 10 seconds
  });

    proximity.on("data", function() {
		console.log(this.cm, ' cm');
    });

//  proximity.on("change", function () {
//    console.log(this.cm + "cm");
//  });

});

