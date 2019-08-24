const request = require('request');

/**
 * Perform and GET request to DarkSky APIs to retrieve weather information for the received latitude and longitude
 *
 * @param {latitude, longitude} the latitude and longitude coordinates for which retrieve the weather information
 * @param callback a callback function returning an error message and the retrieved data to the caller
 */
const getWeather = ({latitude = 0.0, longitude = 0.0} = {}, callback) => {
    let url = 'https://api.darksky.net/forecast/edc117323a12f6f343d46467fc776c01/{latitude},{longitude}?lang=it';
    url = url.replace('{latitude}', latitude);
    url = url.replace('{longitude}', longitude);
    request.get(
        {
            url, // The URL of the request
            json: true // Sets body to JSON representation of value and adds Content-type: application/json header. Additionally, parses the response body as JSON
        },
        (error, response, body) => {
            if (error) {
                callback('Unable to connect to DarkSky APIs', undefined);
            } else {
                const {currently, code: returnedCode} = body;
                if (response.statusCode === 200 && !returnedCode) {
                    const summary = currently.summary;
                    const temp = currently.temperature;
                    const rain = currently.precipProbability;
                    callback(
                        undefined,
                        `${summary}. It is currently ${temp} degrees out. There is ${rain}% chance of rain.`,
                    );
                } else {
                    callback(body.error, undefined);
                }
            }
        }
    );
};

module.exports = {
    getWeather
};