const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/v1/latest`;

const getLatest = () => retry(async () => {
    const { data } = await axios
        .get(URL);

    return data.results;
});

const getLatestCached = () => cache.wrap('latest', () => getLatest());

const getLatestByCountry = (countryCode = '') => getLatestCached().then((data) => data.filter(({ country }) => countryCode.toLocaleLowerCase() === country.toLocaleLowerCase()));

const getLatestByCountryCached = (countryCode = '') => cache.wrap(`latest:${countryCode}`, () => getLatestByCountry(countryCode));

module.exports = {
    getLatest,
    getLatestCached,
    getLatestByCountry,
    getLatestByCountryCached,
};
