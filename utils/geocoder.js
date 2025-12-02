const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, APlace, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;