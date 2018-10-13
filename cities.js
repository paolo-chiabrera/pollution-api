const axios = require('axios');
const _ = require('lodash');

const {
    API_OPENAQ,
    CACHE_TTL_SEC,
    CITIES_KEY,
    CITIES_PATH,
    EVENT_CITIES,
    POLLUTION_CHANNEL,
} = require('./constants');

const getCities = ({ pusher }) => {
    return axios
    .get(`${API_OPENAQ}/cities`)
    .then((res) => {
        const results = _.chain(res)
            .get('data.results')
            .value();

        pusher.trigger(POLLUTION_CHANNEL, EVENT_CITIES, results);

        return results;
    });
};

const init = ({ app, pusher }) => {
    const args = { pusher };

    setInterval(() => {
        getCities(args);
    }, CACHE_TTL_SEC * 1000);

    app.use(CITIES_PATH, (req, res) => {
        getCities(args)
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err));
    });
};

module.exports = {
    getCities,
    init,
};
