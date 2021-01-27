const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const KEY = 'countries';
const URL = `/v1/countries`;

const fetchCountries = () => retry(async () => {
    console.log(`FETCH: ${URL}`);

    const { data } = await axios
        .get(URL, {
            limit: 10000,
        });

    return data.results;
});

const setCountries = async () => {
    try {
        const data = await fetchCountries();
        await cache.setProm(KEY, data);

        console.log(`CACHED: ${URL} [${data.length} items]`);

        return data;
    } catch (err) {
        console.error('setCountries', err);
    }
};

const getCountries = async () => {
    try {
        let data = await cache.getProm(KEY);

        if (data) {
            return data;
        }

        data = await setCountries();

        return data;
    } catch (err) {
        console.error('getCountries', err);
    }
};

module.exports = {
    getCountries,
    setCountries,
};
