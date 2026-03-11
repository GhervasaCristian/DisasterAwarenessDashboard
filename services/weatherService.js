const axios = require('axios');

async function getWeather(latitude, longitude) {
    try {
        const url = 'https://api.open-meteo.com/v1/forecast';
        const response = await axios.get(url, {
            params: {
                latitude,
                longitude,
                current_weather: true
            },
            timeout: 3000
        });

        return {
            temperature: response.data.current_weather.temperature,
            windspeed: response.data.current_weather.windspeed,
            weathercode: response.data.current_weather.weathercode
        };
    } catch (error) {
        return null;
    }
}

module.exports = {
    getWeather
};
