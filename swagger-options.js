const { description, name, version } = require('./package.json');

const PORT = process.env.PORT || '4000';
const isDev = () => process.env.NODE_ENV !== 'production';

module.exports = {
    swaggerDefinition: {
        basePath: '/',
        host: isDev() ? `localhost:${PORT}` : 'api.pollution.sillyapps.io',
        info: {
            description,
            title: name,
            version,
        },
        schemes: isDev() ? ['http'] : ['https'],
        swagger: '2.0',
    },
    apis: ['routes/*.js']
};
