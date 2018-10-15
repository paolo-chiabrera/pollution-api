const axios = require('axios');
const _ = require('lodash');

const {
    API_OPENAQ,
    COUNTRIES_PATH,
} = require('./constants');

const getCountries = () => {
    return axios
        .get(`${API_OPENAQ}/countries`)
        .then((res) => {
            const results = _.chain(res)
                .get('data.results')
                .value();

            return results;
        });
};

const init = ({ app }) => {
    app.use(COUNTRIES_PATH, (req, res) => {
        getCountries()
            .then(data => res.json(data))
            .catch(err => res.status(500).json(err));
    });
};

module.exports = {
    getCountries,
    init,
};
