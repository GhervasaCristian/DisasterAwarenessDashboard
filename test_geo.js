const axios = require('axios');
axios.get('https://geocoding-api.open-meteo.com/v1/reverse', {
  params: {
    latitude: 52.52,
    longitude: 13.41
  }
}).then(res => console.log(JSON.stringify(res.data, null, 2))).catch(e => console.error(e.response?.data || e.message));
