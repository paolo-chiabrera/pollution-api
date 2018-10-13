module.exports = {
    API_OPENAQ: 'https://api.openaq.org/v1',
    CACHE_TTL_SEC: 60,
    CITIES_PATH: '/api/cities',
    COUNTRIES_PATH: '/api/countries',
    EVENT_CITIES: 'event-cities',
    EVENT_COUNTRIES: 'event-countries',
    EVENT_LATEST: 'event-latest',
    LATEST_PATH: '/api/latest',
    POLLUTION_CHANNEL: `pollution-${process.env.NODE_ENV}`,
};