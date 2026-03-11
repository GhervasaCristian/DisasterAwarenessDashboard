const axios = require('axios');

async function getRecentEarthquakes() {
    try {
        const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
        const response = await axios.get(url, {
            params: {
                format: 'geojson',
                orderby: 'time',
                limit: 30
            },
            timeout: 3000
        });

        const features = response.data.features || [];
        return features.map(f => {
            const [longitude, latitude, depth] = f.geometry.coordinates;
            return {
                id: f.id,
                type: 'earthquake',
                magnitude: f.properties.mag,
                timestamp: f.properties.time,
                latitude,
                longitude,
                place: f.properties.place
            };
        });
    } catch (error) {
        throw new Error('Unable to retrieve disaster data');
    }
}

module.exports = {
    getRecentEarthquakes
};
