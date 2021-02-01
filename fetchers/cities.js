const { sortBy } = require('lodash');

const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/v2/cities`;

const getKey = (countryCode = '') => `cities:${countryCode}`;

const fetchCities = (countryCode = '') => retry(async () => {
    console.log(`FETCH: ${URL} - ${countryCode}`);

    const { data: { results } } = await axios
        .get(URL, {
            params: {
                country: countryCode,
                limit: 100000,
            },
        });

    return sortBy(results, 'city');
});

const setCitiesByCountry = async (countryCode = '') => {
    try {
        const data = await fetchCities(countryCode);
        await cache.setProm(getKey(countryCode), data);

        console.log(`CACHED: ${URL} - ${countryCode} [${data.length} items]`);

        return data;
    } catch (err) {
        console.error('setCitiesByCountry', err);
    }
};

const getCitiesByCountry = async (countryCode = '') => {
    try {
        let data = await cache.getProm(getKey(countryCode));

        if (data) {
            return data;
        }

        data = await setCitiesByCountry(countryCode);

        return data;
    } catch (err) {
        console.error('getCitiesByCountry', err);
    }
};

module.exports = {
    getCitiesByCountry,
    setCitiesByCountry,
};
