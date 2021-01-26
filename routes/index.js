const express = require('express');

const getCountries = require('../fetchers/countries');
const { getLatestByCountryCached } = require('../fetchers/latest');
const { getAveragesByCountryCached } = require('../fetchers/averages');

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

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

/* GET latest. */
router.get('/latest/:countryCode', async (req, res) => {
  const { params: { countryCode } } = req;

  try {
    const data = await getLatestByCountryCached(countryCode);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

/* GET averages. */
router.get('/averages/:countryCode', async (req, res) => {
  const { params: { countryCode } } = req;

  try {
    const data = await getAveragesByCountryCached(countryCode);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

module.exports = router;
