const express = require('express');

const { getAveragesByCountry } = require('../fetchers/averages');
const { getCountries } = require('../fetchers/countries');
const { getLatestByCountry } = require('../fetchers/latest');

const router = express.Router();

const { name, version } = require('../package.json');

/* GET home page. */
router.get('/', (req, res) => {
  res.json({
    name,
    version,
  });
});

/* GET countries. */
router.get('/countries', async (req, res) => {
  try {
    const data = await getCountries();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

/* GET latest. */
router.get('/latest/:countryCode', async (req, res) => {
  const { params: { countryCode } } = req;

  try {
    const data = await getLatestByCountry(countryCode);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

/* GET averages. */
router.get('/averages/:countryCode', async (req, res) => {
  const { params: { countryCode } } = req;

  try {
    const data = await getAveragesByCountry(countryCode);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

module.exports = router;
