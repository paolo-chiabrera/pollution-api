const express = require('express');
const cookieParser = require('cookie-parser');
const healthcheck = require('express-healthcheck');
const logger = require('morgan');
const apicache = require('apicache');
const cors = require('cors');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

require('dotenv').config();

const swaggerOptions = require('./swagger-options.js');
const poller = require('./fetchers/poller');

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
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

poller.run();

module.exports = app;
