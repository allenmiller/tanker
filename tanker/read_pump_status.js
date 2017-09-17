const {exec} = require('child_process');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function readPin() {
  let priorState;
  console.log("in readPin()");
  while (true) {
    console.log("true");
    exec('gpio read 25', (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        // node couldn't execute the command
        return;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      let value = parseInt(stdout);
      console.log(value);
      if (!priorState) {
        // if priorState is undefined, initialize it to the first value;
        console.log("priorState is undefined");
        priorState = value;
      }

      if (priorState !== value) {
        console.log("State change!");
        priorState = value;
      }

    });
    await sleep(2000);
  }

}

readPin();