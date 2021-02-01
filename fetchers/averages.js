const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/beta/averages`;

const getKey = (countryCode = '', cityName = '') => `averages:${countryCode}:${cityName}`;

const fetchAverages = (countryCode = '', cityName = '') => retry(async () => {
    console.log(`FETCH: ${URL} - ${countryCode} - ${cityName}`);

    const { data: { results } } = await axios
        .get(URL, {
            params: {
                country: countryCode,
                city: cityName,
                limit: 10000,
            },
        });

    return results;
});

const setAverages = async (countryCode = '', cityName = '') => {
    try {
        const data = await fetchAverages(countryCode, cityName);
        await cache.setProm(getKey(countryCode, cityName), data);

        console.log(`CACHED: ${URL} - ${countryCode} - ${cityName} [${data.length} items]`);

        return data;
    } catch (err) {
        console.error('setAverages', err);
    }
};

const getAverages = async (countryCode = '', cityName = '') => {
    try {
        let data = await cache.getProm(getKey(countryCode, cityName));

        if (data) {
            return data;
        }

        data = await setAverages(countryCode, cityName);

        return data;
    } catch (err) {
        console.error('getAverages', err);
    }
};

module.exports = {
    setAverages,
    getAverages,
};
