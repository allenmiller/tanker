'use strict';

let AWS = require('aws-sdk');

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const alertLevel = 50;

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
  let record = {
    "tank": "secondary",
    "timestamp": body.time,
    "distance_cm": parseFloat(body.distance_cm),
    "sourceIp": event.context.sourceIp
  };

  if (body.reading_mv) {
    record.reading_mV = body.reading_mV;
  }

  console.log("writing: ", record);
  dynamo.putItem({TableName: "tank2", Item: record}, done);
  if (body.distance_cm < alertLevel) {
    console.log("ALERT: critical tank level!");
    // Publish to SNS topic
    var sns = new AWS.SNS();
//    sns.publish({
//          TopicArn: 'arn:aws:sns:us-east-1:235694731559:tanker-notify',
//          Message: "ALERT: Tank level higher than alert limit",
//          Subject: "Tank Level Alert"
//        },
//        function (err, data) {
//          if (err) {
//            console.log("Error sending tank level alert " + err);
//          }
//        });
  }
}
;
