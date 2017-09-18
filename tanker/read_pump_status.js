const request = require('request');
const {exec} = require('child_process');

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
      post_result(record);

    } else {
      console.log("The pump is OFF");
    }
    await sleep(5000);
  }

}

readPin();
