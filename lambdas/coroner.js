exports.handler = (event, context, callback) => {

    let url = "https://rmecu0chj5.execute-api.us-east-1.amazonaws.com/prod/tanker?latest=60";
    var https = require('https');
    var AWS = require('aws-sdk');
    var body = '';
    let bodyJson;
    https.get(url, function (result) {
        console.log('Success, status ' + result.statusCode);
        result.on('data', (d) => {
            body += d;
        });

        result.on('end', () => {
            bodyJson = JSON.parse(body);
            let innerBody = JSON.parse(bodyJson.body);
            if (innerBody.Count === 0) {
                console.log("ERROR: no data within the last hour!");
                // Trigger SNS topic
                var sns = new AWS.SNS();
                sns.publish({
                        TopicArn:'arn:aws:sns:us-east-1:235694731559:tanker-notify',
                        Message:"No Tanker data within the last hour",
                        Subject: "Tanker Coroner Alert "},
                    function(err,data) {
                        if (err){
                            console.log("Error sending Coroner alert "+err);
                        } else {
                            console.log("Sent message ");
                        }
                    });
            }
        });
        result.on('error', function (err) {
            console.log('Error, with: ' + err.message);

        });
    })};