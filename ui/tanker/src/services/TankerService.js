export default {

    getLevels: function (start, end) {
        let url = "https://3nxzqsgs8k.execute-api.us-east-1.amazonaws.com/test/tanker?"
        //let url = "https://rmecu0chj5.execute-api.us-east-1.amazonaws.com/prod/tanker?";
        url += "startTime=" + start;
        url += "&endTime=" + end;

        return fetch(url, {
            method: 'GET',
        })
            .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
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