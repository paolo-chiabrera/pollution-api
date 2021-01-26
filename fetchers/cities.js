const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/v1/cities`;

const getCities = () => retry(async () => {
    const { data } = await axios
        .get(URL);

    return data.results;
});

module.exports = () => cache.wrap('cities', () => getCities());
