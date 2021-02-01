const express = require('express');

const { getAverages } = require('../fetchers/averages');
const { getCitiesByCountry } = require('../fetchers/cities');
const { getCountries } = require('../fetchers/countries');
const { getLatest } = require('../fetchers/latest');

const router = express.Router();

/**
 * @swagger
 *
 * /countries:
 *   get:
 *     summary: List of all the countries available
 *     produces:
 *       - application/json
 */
router.get('/countries', async (req, res) => {
  try {
    const data = await getCountries();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

/**
 * @swagger
 *
 * /cities/{countryCode}:
 *   get:
 *     summary: List of the available cities for the given country
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: countryCode
 *         in: path
 *         required: true
 *         type: string
 *         description: 2 letters country code as defined by ISO ALPHA-2
 */
router.get('/cities/:countryCode', async (req, res) => {
  const { params: { countryCode } } = req;

  if (!countryCode) {
    res.status(500).send('Please provide a countryCode');
    return;
  }

  try {
    const data = await getCitiesByCountry(countryCode);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

/**
 * @swagger
 *
 * /latest/{countryCode}/{cityName}:
 *   get:
 *     summary: List of the latests measurements for the given country
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: countryCode
 *         in: path
 *         required: true
 *         type: string
 *         description: 2 letters country code as defined by ISO ALPHA-2
 *       - name: cityName
 *         in: path
 *         required: true
 *         type: string
 *         description: Name of the city
 */
router.get('/latest/:countryCode/:cityName', async (req, res) => {
  const { params: { cityName, countryCode } } = req;

  if (!countryCode) {
    res.status(500).send('Please provide a countryCode');
    return;
  }

  if (!cityName) {
    res.status(500).send('Please provide a cityName');
    return;
  }

  try {
    const data = await getLatest(countryCode, cityName);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

/**
 * @swagger
 *
 * /averages/{countryCode}/{cityName}:
 *   get:
 *     summary: List of the average measurements for the given country
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: countryCode
 *         in: path
 *         required: true
 *         type: string
 *         description: 2 letters country code as defined by ISO ALPHA-2
 *       - name: cityName
 *         in: path
 *         required: true
 *         type: string
 *         description: Name of the city
 */
router.get('/averages/:countryCode/:cityName', async (req, res) => {
  const { params: { cityName, countryCode } } = req;

  if (!countryCode) {
    res.status(500).send('Please provide a countryCode');
    return;
  }

  if (!cityName) {
    res.status(500).send('Please provide a cityName');
    return;
  }

  try {
    const data = await getAverages(countryCode, cityName);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad bad happened!');
  }
});

module.exports = router;
