const { chain, isEmpty } = require('lodash');

const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/v1/cities`;

const getKey = (countryCode = '') => `cities:${countryCode}`;

const isValidCity = (str = '') => !isEmpty(str) && str.toLowerCase() !== 'n/a';

const fetchCities = (countryCode = '') => retry(async () => {
    console.log(`FETCH: ${URL} - ${countryCode}`);

    const { data: { results } } = await axios
        .get(URL, {
            params: {
                country: countryCode,
                limit: 10000,
            },
        });

    return chain(results)
        .filter(({ city, name }) => isValidCity(city) && isValidCity(name))
        .sortBy('name')
        .value();
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
