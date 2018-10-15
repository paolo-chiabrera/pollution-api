const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const healthcheck = require('express-healthcheck');
const logger = require('morgan');
const apicache = require('apicache');
const cors = require('cors');
const compression = require('compression');

require('dotenv').config();

const app = express();

app.use(cors({
    methods: ['GET'],
}));
app.use(logger('dev'));
app.use('/healthcheck', healthcheck());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(apicache.middleware('5 minutes'));

const index = require('./routes/index');

app.use(index);

const cities = require('./cities');
const countries = require('./countries');
const latest = require('./latest');

const args = { app };

cities.init(args);
countries.init(args);
latest.init(args);

module.exports = app;
