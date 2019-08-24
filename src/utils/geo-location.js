const request = require('request');

/**
 * Perform and GET request to MapBox APIs to retrieve geo information about received location name
 *
 * @param location a string with the location for which extract the coordinates data
 * @param callback a callback function returning an error message and the retrieved data to the caller
 */
const geoCode = (location, callback) => {
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/{location}.json?limit=1&access_token=pk.eyJ1IjoiZ2FicmllbGUtZGVsbW9udGUiLCJhIjoiY2p5bzRzdWVxMTB6cTNscm9paTdsand1ZyJ9.xrIzbFB4nVHfBTIyz8BOCQ';
    url = url.replace('{location}', encodeURIComponent(location));
    request.get(
        {
            url,
            json: true
        },
        (error, response, body) => {
            if (error) {
                callback('Unable to connect to MapBox APIs', undefined);
            } else {
                const {features} = body;
                if (features && features.length >= 1 && features[0].center) {
                    callback(
                        undefined,
                        {
                            latitude: features[0].center[1],
                            longitude: features[0].center[0],
                            location: features[0].place_name
                        }
                    );
                } else {
                    callback('Unable to find location for provided input', undefined);
                }
            }
        });
};

module.exports = {
    geoCode
};