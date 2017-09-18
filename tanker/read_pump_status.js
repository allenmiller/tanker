import Utils from './utils';
const {exec} = require('child_process');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function readPin() {
  let priorState = -1;  // valid values are 0 and 1

  while (true) {
    let date = new Date();
    console.log("true");
    exec('gpio read 25', (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        console.log(stderr);
        // node couldn't execute the command
      }

      let value = parseInt(stdout);
      console.log(value);
      if (priorState === -1) {
        // initialize priorState on startup
        priorState = value;
      }

      if (priorState !== value) {
        console.log("State change!");
        priorState = value;
      }

    });

    if (value) {
      console.log("POST pump on at ", date.getTime())
      let record = {};
      record.type = "PUMP_STATE";
      record.tank = "SEPTIC-PUMP";
      record.state = 1;
      record.time = date.getTime();
      Utils.post_result(record);

    } else {
      console.log("The pump is OFF");
    }
    await sleep(5000);
  }

}

readPin();
