const {exec} = require('child_process');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function readPin() {
  let priorState = -1;  // valid values are 0 and 1
  console.log("in readPin()");

  while (true) {
    let date = new Date();
    console.log("true");
    exec('gpio read 25', (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        console.log(stderr);
        // node couldn't execute the command
        return;
      }

      let value = parseInt(stdout);
      console.log(value);
      if (priorState === -1) {
        console.log("priorState was undefined");
        priorState = value;
      }

      if (priorState !== value) {
        console.log("State change!");
        priorState = value;
      }

    });
    if (priorState) {
      console.log("The pump is ON");
      console.log("POST pump on at ", date.getTime())
    } else {
      console.log("The pump is OFF");
    }
    await sleep(2000);
  }

}

readPin();
