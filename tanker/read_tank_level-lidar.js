const PythonShell = require('python-shell');
const request = require('request');

let pyshell = new PythonShell('test.py',
  {scriptPath: '/home/pi/git/github.com/Sanderi44/Lidar-Lite/python/'});

const date = new Date();
const sensor = 'LL-905-PIN-01';
const SENSOR_LEVEL = 40;  // cm below ground level

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

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

