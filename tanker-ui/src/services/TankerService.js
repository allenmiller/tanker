export default {

  getLevels: function (start, end) {
    let url = "https://3nxzqsgs8k.execute-api.us-east-1.amazonaws.com/test/tanker?";
    url += "startTime=" + start;
    url += "&endTime=" + end;

    return fetch(url, {
      method: 'GET',
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
}