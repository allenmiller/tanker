export default {

    getLevels: function(start, end) {
        let url = "https://rmecu0chj5.execute-api.us-east-1.amazonaws.com/prod/tanker?";
        url += "startTime=" + start;
        url += "&endTime=" +end;

        return fetch(url, {
            method: 'GET',
        })
            .then((response) => {
                return response.json();
            });
    },
}