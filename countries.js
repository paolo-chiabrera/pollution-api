const axios = require('axios');
const _ = require('lodash');

const {
    API_OPENAQ,
    CACHE_TTL_SEC,
    COUNTRIES_PATH,
    EVENT_COUNTRIES,
    POLLUTION_CHANNEL,
} = require('./constants');

const getCountries = ({ pusher }) => {
    return axios.get(`${API_OPENAQ}/countries`)
        .then((res) => {
            const results = _.chain(res)
                .get('data.results')
                .value();

            pusher.trigger(POLLUTION_CHANNEL, EVENT_COUNTRIES, results);

            return results;
        });
};

const init = ({ app, pusher }) => {
    const args = { pusher };

    setInterval(() => {
        getCountries(args);
    }, CACHE_TTL_SEC * 1000);

    app.use(COUNTRIES_PATH, (req, res) => {
        getCountries(args)
            .then(data => res.json(data))
            .catch(err => res.status(500).json(err));
    });
};

module.exports = {
    getCountries,
    init,
};
