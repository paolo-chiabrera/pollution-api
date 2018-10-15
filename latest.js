const axios = require('axios');
const _ = require('lodash');
const os = require('os');
const Promise = require('bluebird');

const countries = require('./countries');

const {
    API_OPENAQ,
    LATEST_PATH,
} = require('./constants');

const getLatestByCountry = ({ country }) => {
    return axios
        .get(`${API_OPENAQ}/latest`, {
            params: {
                country,
            },
        })
        .then((res) => {
            const results = _.chain(res)
                .get('data.results')
                .map(city => {
                    city.measurements = _.chain(city.measurements)
                        .uniqBy(({ lastUpdated, parameter, value }) => `${lastUpdated}_${parameter}_${value}`)
                        .sortBy(['parameter', 'lastUpdated'])
                        .value();

                    return city;
                })
                .value();

            return results;
        })
        .catch(err => {
            console.error(`GET /latest ${country}`, err);
        });
};

const getLatest = ({ countries }) => {
    console.log(`Total countries: ${_.size(countries)}`);

    return Promise
        .each(countries, country => getLatestByCountry({
            country: country.code,
        }))
        .then(() => console.log('ALL latest OK'))
        .catch(err => console.error('ALL latest KO', err));
};

const init = ({ app }) => {
    countries
        .getCountries()
        .then(countries => {
            const args = {
                countries,
            };

            getLatest(args);
        });

    app.use(`${LATEST_PATH}`, (req, res) => {
        const { country } = req.query;

        getLatestByCountry({ country })
            .then(data => res.json(data))
            .catch(err => res.status(500).json(err));
    });
};

module.exports = {
    getLatest,
    init,
};
