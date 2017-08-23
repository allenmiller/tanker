let PythonShell = require('python-shell');
let pyshell = new PythonShell('test.py', {scriptPath: '/home/pi/git/github.com/Sanderi44/Lidar-Lite/python/'});
let request = require('request');
let sensor = 'LL-905-PIN-01';

let date = new Date();
let postUrl = 'https://rmecu0chj5.execute-api.us-east-1.amazonaws.com/prod/tanker';

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

pyshell.on('message', (distanceStr) => {
    "use strict";
    console.log(distanceStr);
    let distance = parseInt(distanceStr);
    
    let record = {};

    record.distance_cm = distance;
    record.time = date.getTime();
    record.sensor = sensor;
    
    post_result(record);

});

pyshell.end();

