const axios = require('axios');
axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
  params: {
    latitude: 52.52,
    longitude: 13.41,
    localityLanguage: 'en'
  }
}).then(res => console.log(JSON.stringify(res.data, null, 2))).catch(e => console.error(e.message));
