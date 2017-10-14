// Tank Levels

// Relative to   ground         sensor
// ground level    0              -56
// sensor         56                0
// top of tank    62                6
// alarm level    90               34
// lower limit    137              81
// bottom of tank 202             146


'use strict';

let AWS = require('aws-sdk');

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

// tank levels below ground.

const TOP_OF_TANK = 62;
const ALARM_LEVEL = 90;
const ALERT_LEVEL = 100;
const LOWER_LIMIT = 137;
const BOTTOM = 202;


// TODO: normalize sensor reading distance to represent tank level as measured
// from the surface.

exports.handler = (event, context, callback) => {

  console.log('AJM: Received event:', JSON.stringify(event, null, 2));
  console.log('context:', JSON.stringify(context, null, 2));
  const done = (err, res) => {
    console.log("AJM: in done()", err, res);
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  let body = event["body-json"];
  let record = {};

  switch (body.type) {

    case 'PUMP_STATE':
      record = {
        "tank": body.tank,
        "timestamp": body.time,
        "pumpState": body.state
      };
      break;
    default:
      record = {
        "tank": "secondary",
        "sensor": body.sensor,
        "timestamp": body.time,
        "distance_cm": parseFloat(body.distance_cm) + body.sensorLevel,
        "sourceIp": event.context.sourceIp
      };

      if (body.sensor === "MAXBOTIX_DC") {
        record.reading_mV = body.reading_mV;
      }
  }

  console.log("writing: ", record);
  dynamo.putItem({TableName: "tank2", Item: record}, done);

  let ipRecord = {
    "tank": "latestIp",
    "timestamp": 0,
    "ipAddress": event.context.sourceIp
  };
  dynamo.putItem({TableName: "tank2", Item: ipRecord}, done);

  if (record.distance_cm < ALERT_LEVEL) {
    console.log("ALERT: critical tank level!");
    // Publish to SNS topic
    let sns = new AWS.SNS();
    sns.publish({
        TopicArn: 'arn:aws:sns:us-east-1:235694731559:tanker-notify',
        Message: "ALERT: Tank level higher than alert limit",
        Subject: "Tank Level Alert"
      },
      function (err, data) {
        if (err) {
          console.log("Error sending tank level alert " + err);
        }
      });
  }
};
