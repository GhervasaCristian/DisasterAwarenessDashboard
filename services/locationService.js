const axios = require('axios');

async function getLocation(latitude, longitude) {
    try {
        const url = 'https://geocoding-api.open-meteo.com/v1/reverse';
        const response = await axios.get(url, {
            params: {
                latitude,
                longitude
            },
            timeout: 3000
        });

        const results = response.data.results;
        if (results && results.length > 0) {
            return {
                country: results[0].country,
                city: results[0].city || results[0].name
            };
        }
        return { country: undefined, city: undefined };
    } catch (error) {
        return { country: undefined, city: undefined };
    }
}

module.exports = {
    getLocation
};
