export default {

  tankerGet: function(url, requestMethod) {
    return fetch(url, {
      method: requestMethod,
    })
      .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            // eslint-disable-next-line
            throw {
              message: "Tanker service error : " + response.status,
              responseStatus: {
                code: response.status,
                message: response.statusText
              },
              body: response.text()
            }
          }
        }
      );
  },

  getLevels: function (start, end) {
    let url = "https://3nxzqsgs8k.execute-api.us-east-1.amazonaws.com/test/tanker?";
    url += "startTime=" + start;
    url += "&endTime=" + end;
    url += "&dataSet=secondary";

    return this.tankerGet(url, "GET");
  },

  getPumpState: function (start, end) {
    let url = "https://3nxzqsgs8k.execute-api.us-east-1.amazonaws.com/test/tanker?";
    url += "startTime=" + start;
    url += "&endTime=" + end;
    url += "&dataSet=SEPTIC-PUMP";

    return this.tankerGet(url, "GET");
  }
}