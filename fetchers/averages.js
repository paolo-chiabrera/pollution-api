const { stringify } = require('querystring');

const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/beta/averages`;

const getAveragesByCountry = (countryCode = '') => retry(async () => {
    const qs = stringify({
        country: countryCode,
        limit: 10000,
    });
    const { data: { results } } = await axios
        .get(`${URL}?${qs}`);

    return results;
});

const getAveragesByCountryCached = (countryCode = '') => cache.wrap(`averages:${countryCode}`, () => getAveragesByCountry(countryCode));

module.exports = {
    getAveragesByCountry,
    getAveragesByCountryCached,
};
