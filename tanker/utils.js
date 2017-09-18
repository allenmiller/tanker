const request = require('request');

export default {

  PUMP_STATE: 'PUMP_STATE',

  post_result: function (record) {

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
  }
}
