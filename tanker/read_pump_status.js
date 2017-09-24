const request = require('request');
const {exec} = require('child_process');

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

post_result = (record) => {

  const postUrl = 'https://rmecu0chj5.execute-api.us-east-1.amazonaws.com/prod/tanker';
  console.log("Posting ", record);
  request.post({
    url: postUrl,
    json: true,
    body: record
  }, function (error, response, body) {
    if (error) {
      console.log("ERROR");
      console.log(response);
      console.log(body);
      throw error;
    }

  });
};

async function readPin(pin) {
  let priorState = -1;  // valid values are 0 and 1
  let value;
  let command = 'gpio read ' + pin;

  while (true) {
    let date = new Date();
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        console.log(stderr);
        // node couldn't execute the command
      }

      value = parseInt(stdout);
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
      record.tank = TANK;
      record.state = 1;
      record.time = date.getTime();
      post_result(record);

    } else {
      console.log(`The pump ${TANK} on pin ${PIN} is OFF`);
    }
    await sleep(SLEEP);
  }

}

readPin(PIN);
