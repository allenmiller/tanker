'use strict';

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {

    // console.log('AJM: Received event:', JSON.stringify(event, null, 2));
    // console.log('context:', JSON.stringify(context, null, 2));
    const done = (err, res) => {
        // console.log("AJM: in done()", err, res);
        callback(null,{
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
     });
    };
    let d = new Date();
    let record = { 
        "tank": "secondary",
        "timestamp": d.getTime(), 
        "level": event.params.querystring.level,
        "sourceIp": event.context.sourceIp
    };
    console.log("writing: ", record);
    dynamo.putItem({TableName: "tank2", Item: record}, done);
};
