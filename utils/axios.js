const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.openaq.org/',
    timeout: 5000,
});

instance.interceptors.request.use(config => {
    const { method, url } = config;
    console.log(`STARTED: ${method} - ${url}`);
    return config;
})

instance.interceptors.response.use(response => {
    const { method, url } = response.config;
    console.log(`FINISHED: ${method} - ${url}: ${response.status}`);
    return response;
})

module.exports = instance;
