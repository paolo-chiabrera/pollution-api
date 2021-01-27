const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/v1/latest`;

const getKey = (countryCode = '') => `latest:${countryCode}`;

const fetchLatestByCountry = (countryCode = '') => retry(async () => {
    console.log(`FETCH: ${URL} - ${countryCode}`);

    const { data: { results } } = await axios
        .get(URL, {
            country: countryCode,
            limit: 10000,
        });

    return results;
});

const setLatestByCountry = async (countryCode = '') => {
    try {
        const data = await fetchLatestByCountry(countryCode);
        await cache.setProm(getKey(countryCode), data);

        console.log(`CACHED: ${URL} - ${countryCode} [${data.length} items]`);

        return data;
    } catch (err) {
        console.error('setLatestByCountry', err);
    }
};

const getLatestByCountry = async (countryCode = '') => {
    try {
        let data = await cache.getProm(getKey(countryCode));

        if (data) {
            return data;
        }

        data = await setLatestByCountry(countryCode);

        return data;
    } catch (err) {
        console.error('getLatestByCountry', err);
    }
};


module.exports = {
    getLatestByCountry,
    setLatestByCountry,
};
