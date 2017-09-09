let PythonShell = require('python-shell');
let pyshell = new PythonShell('test.py',
    {scriptPath: '/home/pi/git/github.com/Sanderi44/Lidar-Lite/python/'});
let request = require('request');

const date = new Date();
const postUrl = 'https://rmecu0chj5.execute-api.us-east-1.amazonaws.com/prod/tanker';
const sensor = 'LL-905-PIN-01';
const SENSOR_LEVEL = 50;  // cm below ground level

function post_result(record) {

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
}

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

pyshell.on('message', (distanceStr) => {
  "use strict";
  console.log(distanceStr);
  let distance = parseInt(distanceStr);

  let record = {};

  record.sensor = sensor;
  record.sensorLevel = SENSOR_LEVEL;
  record.distance_cm = distance;
  record.time = date.getTime();

  post_result(record);

});

pyshell.end();

