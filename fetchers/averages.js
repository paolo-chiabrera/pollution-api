const { chain, isEqual, sortBy } = require('lodash');

const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/v2/averages`;

const getKey = (countryCode = '') => `averages:${countryCode}`;

const fetchAverages = (countryCode = '') => retry(async () => {
    const temporal = 'day';
    const d = new Date();
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDay());
    const oneYearAgo = new Date(d.getFullYear() - 1, d.getMonth(), d.getDay());

    console.log(`FETCH: ${URL} - ${countryCode}`);

    const { data: { results } } = await axios
        .get(URL, {
            params: {
                country: countryCode,
                date_from: oneYearAgo.toISOString(),
                date_to: today.toISOString(),
                limit: 100000,
                spatial: 'country',
                temporal,
            },
        });

    return chain(results)
        .uniqWith(isEqual)
        .groupBy(temporal)
        .mapValues(group => sortBy(group, 'displayName'))
        .value();
});

const setAverages = async (countryCode = '') => {
    try {
        const data = await fetchAverages(countryCode);
        await cache.setProm(getKey(countryCode), data);

        console.log(`CACHED: ${URL} - ${countryCode} [${Object.keys(data).length} days]`);

        return data;
    } catch (err) {
        console.error('setAverages', err);
    }
};

const getAverages = async (countryCode = '') => {
    try {
        let data = await cache.getProm(getKey(countryCode));

        if (data) {
            return data;
        }

        data = await setAverages(countryCode);

        return data;
    } catch (err) {
        console.error('getAverages', err);
    }
};

module.exports = {
    setAverages,
    getAverages,
};
