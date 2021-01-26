const { stringify } = require('querystring');

const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/v1/latest`;

const getLatestByCountry = (countryCode = '') => retry(async () => {
    const qs = stringify({
        country: countryCode,
        limit: 10000,
    });
    const { data: { results } } = await axios
        .get(`${URL}?${qs}`);

    return results;
});

const getLatestByCountryCached = (countryCode = '') => cache.wrap(`latest:${countryCode}`, () => getLatestByCountry(countryCode));

module.exports = {
    getLatestByCountry,
    getLatestByCountryCached,
};
