const axios = require('../utils/axios');
const cache = require('../utils/cache');
const retry = require('../utils/retry');

const URL = `/beta/averages`;

const getAverages = () => retry(async () => {
    const { data } = await axios
        .get(URL);

    return data.results;
});

const getAveragesCached = () => cache.wrap('averages', () => getAverages());

const getAveragesByCountry = (countryCode = '') => getAveragesCached().then((data) => data.filter(({ country }) => countryCode.toLocaleLowerCase() === country.toLocaleLowerCase()));

const getAveragesByCountryCached = (countryCode = '') => cache.wrap(`averages:${countryCode}`, () => getAveragesByCountry(countryCode));

module.exports = {
    getAverages,
    getAveragesCached,
    getAveragesByCountry,
    getAveragesByCountryCached,
};