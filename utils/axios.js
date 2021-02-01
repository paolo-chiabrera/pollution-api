const axios = require('axios');

const baseURL = process.env.BASE_URL || 'https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/';

const instance = axios.create({
    baseURL,
    timeout: 5000,
});

module.exports = instance;
