import Utils from './utils';


let PythonShell = require('python-shell');
let pyshell = new PythonShell('test.py',
    {scriptPath: '/home/pi/git/github.com/Sanderi44/Lidar-Lite/python/'});

const date = new Date();
const sensor = 'LL-905-PIN-01';
const SENSOR_LEVEL = 40;  // cm below ground level

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

  Utils.post_result(record);

});

pyshell.end();

