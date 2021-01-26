const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-redis-store');

const { CACHE_TTL_SECONDS, DATABASE_URL, NODE_ENV } = process.env;

const ENV = NODE_ENV || 'development';

const cache = cacheManager.caching({
    prefix: `pollution:api:${ENV}`,
    refreshThreshold: (parseInt(CACHE_TTL_SECONDS, 10) || 60 * 60) / 2, // seconds
    store: redisStore,
    ttl: CACHE_TTL_SECONDS || 60 * 60, // seconds
    url: DATABASE_URL,
});

const redisClient = cache.store.getClient();

redisClient.on('error', (error) => {
    console.error(error);
});

module.exports = cache;
