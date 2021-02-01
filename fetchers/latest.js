const { sortBy } = require('lodash');

const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/v2/latest`;

const getKey = (countryCode = '', cityName = '') => `latest:${countryCode}:${cityName}`;

const fetchLatest = (countryCode = '', cityName = '') => retry(async () => {
    console.log(`FETCH: ${URL} - ${countryCode} - ${cityName}`);

    const { data: { results } } = await axios
        .get(URL, {
            params: {
                country_id: countryCode,
                city: cityName,
                limit: 100000,
            },
        });

    return sortBy(results, 'location');
});

const setLatest = async (countryCode = '', cityName = '') => {
    try {
        const data = await fetchLatest(countryCode, cityName);
        await cache.setProm(getKey(countryCode, cityName), data);

        console.log(`CACHED: ${URL} - ${countryCode} - ${cityName} [${data.length} items]`);

        return data;
    } catch (err) {
        console.error('setLatest', err);
    }
};

const getLatest = async (countryCode = '', cityName = '') => {
    try {
        let data = await cache.getProm(getKey(countryCode, cityName));

        if (data) {
            return data;
        }

        data = await setLatest(countryCode, cityName);

        return data;
    } catch (err) {
        console.error('getLatest', err);
    }
};


module.exports = {
    getLatest,
    setLatest,
};
