const axios = require('axios');
axios.get('https://nominatim.openstreetmap.org/reverse', {
  params: {
    lat: 52.52,
    lon: 13.41,
    format: 'json'
  },
  headers: {
    'User-Agent': 'TAD-Tema1-Demo/1.0'
  }
}).then(res => console.log(JSON.stringify(res.data, null, 2))).catch(e => console.error(e.message));
