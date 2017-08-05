let ads1x15 = require('node-ads1x15');
let request = require('request');

let chip = 1; //0 for ads1015, 1 for ads1115
let adc = new ads1x15(chip);

let channel = 0;
let samplesPerSecond = '250'; // see index.js for allowed values for your chip
let progGainAmp = '2048'; // see index.js for allowed values for your chip

let reading;
let factor = (5.0 * 25.4) / 512;  // (Vcc * 25.4 mm/inch) / (512 mv/inch)
let date = new Date();

let postUrl = 'https://rmecu0chj5.execute-api.us-east-1.amazonaws.com/prod/tanker';


function post_result(record) {

    console.log("Posting ", record);
    request.post({
	headers: {'content-type' : 'application/json'},
	url:     postUrl + "?level="+record.distance_cm
//	body:    record
    }, function(error, response, body){
	if (error) {
	    console.log("ERROR");
	    console.log(response);
	    console.log(body);
	    throw error;
	}

    });
}

if(!adc.busy)
{
    adc.readADCSingleEnded(channel, progGainAmp, samplesPerSecond, function(err, data) {
	if(err)
	{
	    throw err;
	}

	reading = parseFloat(data);

	let distance = reading * factor;
	let record = {};

	record.reading_mV = reading;
	record.distance_cm = distance;
	record.time = date.getTime();

	post_result(record);
    });
}
