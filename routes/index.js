const express = require('express');

const getCities = require('../fetchers/cities');
const getCountries = require('../fetchers/countries');
const getLatest = require('../fetchers/latest');

const router = express.Router();

const { name, version } = require('../package.json');

/* GET home page. */
router.get('/', (req, res) => {
  res.json({
    name,
    version,
  });
});

/* GET cities. */
setTimeout(() => getCities(), 0);
setInterval(() => getCities(), 30 * 1000);

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
setInterval(() => getCountries(), 30 * 1000);

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
setTimeout(() => getLatest(), 0);
setInterval(() => getLatest(), 30 * 1000);

router.get('/latest', async (req, res) => {
  try {
    const data = await getLatest();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

router.get('/latest/:countryCode', async (req, res) => {
  const { params } = req;

  try {
    const data = await getLatest();

    res.status(200).json(data.filter(({ country }) => params.countryCode.toLocaleLowerCase() === country.toLocaleLowerCase()));
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

module.exports = router;
