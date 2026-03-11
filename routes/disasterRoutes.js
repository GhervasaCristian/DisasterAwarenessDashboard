const express = require('express');
const router = express.Router();
const earthquakeService = require('../services/earthquakeService');
const weatherService = require('../services/weatherService');
const locationService = require('../services/locationService');

router.get('/disasters', async (req, res) => {
    try {
        const earthquakes = await earthquakeService.getRecentEarthquakes();
        const results = await Promise.all(earthquakes.map(async (eq) => {
            const weather = await weatherService.getWeather(eq.latitude, eq.longitude);
            const location = await locationService.getLocation(eq.latitude, eq.longitude);

            return {
                id: eq.id,
                type: 'earthquake',
                magnitude: eq.magnitude,
                timestamp: eq.timestamp,
                latitude: eq.latitude,
                longitude: eq.longitude,
                location_name: eq.place,
                country: location ? location.country : undefined,
                city: location ? location.city : undefined,
                weather: weather || undefined
            };
        }));

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to retrieve disaster data' });
    }
});

module.exports = router;
