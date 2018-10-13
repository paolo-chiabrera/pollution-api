const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const healthcheck = require('express-healthcheck');
const logger = require('morgan');
const apicache = require('apicache');
const cors = require('cors');
const compression = require('compression');

require('dotenv').config();

const {
    PUSHER_APP_ID,
    PUSHER_APP_KEY,
    PUSHER_APP_SECRET,
} = process.env;

const Pusher = require('pusher');
const pusher = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_APP_KEY,
    secret: PUSHER_APP_SECRET,
    cluster: 'eu',
    encrypted: true
});

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

const args = { app, pusher };

cities.init(args);
countries.init(args);
latest.init(args);

module.exports = app;
