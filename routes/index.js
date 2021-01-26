const express = require('express');

const getCities = require('../fetchers/cities');
const getCountries = require('../fetchers/countries');
const { getLatestCached, getLatestByCountryCached } = require('../fetchers/latest');
const { getAveragesCached, getAveragesByCountryCached } = require('../fetchers/averages');

const router = express.Router();

const { name, version } = require('../package.json');

const REFRESH_INTERVAL = 60;

/* GET home page. */
router.get('/', (req, res) => {
  res.json({
    name,
    version,
  });
});

/* GET cities. */
setTimeout(() => getCities(), 0);
setInterval(() => getCities(), REFRESH_INTERVAL * 1000);

router.get('/cities', async (req, res) => {
  try {
    const data = await getCities();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

/* GET countries. */
setTimeout(() => getCountries(), 0);
setInterval(() => getCountries(), REFRESH_INTERVAL * 1000);

router.get('/countries', async (req, res) => {
  try {
    const data = await getCountries();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

/* GET countries. */
setTimeout(() => getLatestCached(), 0);
setInterval(() => getLatestCached(), REFRESH_INTERVAL * 1000);

router.get('/latest', async (req, res) => {
  try {
    const data = await getLatestCached();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

router.get('/latest/:countryCode', async (req, res) => {
  const { params } = req;

  try {
    const data = await getLatestByCountryCached(params.countryCode);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

/* GET countries. */
setTimeout(() => getAveragesCached(), 0);
setInterval(() => getAveragesCached(), REFRESH_INTERVAL * 1000);

router.get('/averages', async (req, res) => {
  try {
    const data = await getAveragesCached();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

router.get('/averages/:countryCode', async (req, res) => {
  const { params } = req;

  try {
    const data = await getAveragesByCountryCached(params.countryCode);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

module.exports = router;
