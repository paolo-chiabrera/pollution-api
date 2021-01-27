const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.openaq.org/',
    timeout: 5000,
});

module.exports = instance;
