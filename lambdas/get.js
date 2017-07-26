'use strict';

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let startTime = event.params.querystring.startTime;
    let endTime = event.params.querystring.endTime;
    let params = {
        TableName: "tank2",
        KeyConditionExpression: "tank = :tk AND #ts BETWEEN :start and :end",
        ExpressionAttributeNames: {
            "#ts": "timestamp"
        },
        ExpressionAttributeValues: {
            ":tk": "secondary",
            ":start": startTime,
            ":end": endTime
        }
    };
    console.log(params);
    dynamo.query(params, done);
};
