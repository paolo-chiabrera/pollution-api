const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/latest`;

const getLatest = () => retry(async () => {
    const { data } = await axios
        .get(URL);

    return data.results;
});

module.exports = () => cache.wrap('getLatest', () => getLatest());