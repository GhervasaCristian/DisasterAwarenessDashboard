const axios = require('axios');

async function getLocation(latitude, longitude) {
    try {
        // Open-Meteo Geocoding API does not have a /v1/reverse endpoint.
        // We use the free BigDataCloud Reverse Geocoding API as a powerful alternative.
        const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
        const response = await axios.get(url, {
            params: {
                latitude,
                longitude,
                localityLanguage: 'en'
            },
            timeout: 3000
        });

        const data = response.data;
        if (data && (data.countryName || data.city || data.locality)) {
            return {
                country: data.countryName || undefined,
                city: data.city || data.locality || undefined
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
