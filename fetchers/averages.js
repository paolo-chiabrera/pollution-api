const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/beta/averages`;

const getKey = (countryCode = '') => `averages:${countryCode}`;

const fetchAveragesByCountry = (countryCode = '') => retry(async () => {
    console.log(`FETCH: ${URL} - ${countryCode}`);

    const { data: { results } } = await axios
        .get(URL, {
            params: {
                country: countryCode,
                limit: 10000,
            },
        });

    return results;
});

const setAveragesByCountry = async (countryCode = '') => {
    try {
        const data = await fetchAveragesByCountry(countryCode);
        await cache.setProm(getKey(countryCode), data);

        console.log(`CACHED: ${URL} - ${countryCode} [${data.length} items]`);

        return data;
    } catch (err) {
        console.error('setAveragesByCountry', err);
    }
};

const getAveragesByCountry = async (countryCode = '') => {
    try {
        let data = await cache.getProm(getKey(countryCode));

        if (data) {
            return data;
        }

        data = await setAveragesByCountry(countryCode);

        return data;
    } catch (err) {
        console.error('getAveragesByCountry', err);
    }
};

module.exports = {
    setAveragesByCountry,
    getAveragesByCountry,
};
