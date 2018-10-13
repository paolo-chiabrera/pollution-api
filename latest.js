const axios = require('axios');
const _ = require('lodash');
const os = require('os');
const Promise = require('bluebird');

const countries = require('./countries');

const {
    API_OPENAQ,
    CACHE_TTL_SEC,
    EVENT_LATEST,
    LATEST_PATH,
    POLLUTION_CHANNEL,
} = require('./constants');

const getLatestByCountry = ({ country, pusher }) => {
    const EVENT_LATEST_COUNTRY = `${EVENT_LATEST}-${country}`;

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

        pusher.trigger(POLLUTION_CHANNEL, EVENT_LATEST_COUNTRY, results);

        return results;
    })
    .catch(err => {
        console.error(`GET /latest ${country}`, err);
    });
};

const getLatest = ({ countries, pusher }) => {
    console.log(`Total countries: ${_.size(countries)}`);

    return Promise
    .each(countries, country => getLatestByCountry({
        country: country.code,
        pusher,
    }))
    .then(() => console.log('ALL latest OK'))
    .catch(err => console.error('ALL latest KO', err));
};

const init = ({ app, pusher }) => {
    countries
    .getCountries({ pusher })
    .then(countries => {
        const args = {
            countries,
            pusher,
        };

        getLatest(args);

        setInterval(() => {
            getLatest(args);
        }, CACHE_TTL_SEC * 1000);
    });

    app.use(`${LATEST_PATH}`, (req, res) => {
        const { country } = req.query;

        getLatestByCountry({ country, pusher })
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err));
    });
};

module.exports = {
    getLatest,
    init,
};
