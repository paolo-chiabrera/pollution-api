const axios = require('axios');
const _ = require('lodash');

const {
    API_OPENAQ,
    CITIES_PATH,
} = require('./constants');

const getCities = () => {
    return axios
        .get(`${API_OPENAQ}/cities`)
        .then((res) => {
            const results = _.chain(res)
                .get('data.results')
                .value();

            return results;
        });
};

const init = ({ app }) => {
    app.use(CITIES_PATH, (req, res) => {
        getCities()
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err));
    });
};

module.exports = {
    getCities,
    init,
};
