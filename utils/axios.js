const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.openaq.org/',
    timeout: 5000,
});

instance.interceptors.request.use(request => {
    const { method, url } = request;
    console.log(`STARTED: ${method} - ${url}`);
    return request;
})

instance.interceptors.response.use(response => {
    const { method, url } = response.config;
    console.log(`FINISHED: ${method} - ${url}: ${response.status}`);
    return response;
})

module.exports = instance;
