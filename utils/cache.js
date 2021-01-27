const { promisify } = require('util');
const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-redis-store');

const { DATABASE_URL, NODE_ENV } = process.env;

const ENV = NODE_ENV || 'development';

const cache = cacheManager.caching({
    prefix: `pollution:api:${ENV}`,
    store: redisStore,
    url: DATABASE_URL,
});

cache.getProm = promisify(cache.get);
cache.setProm = promisify(cache.set);

const redisClient = cache.store.getClient();

redisClient.on('error', (error) => {
    console.error('redis', error);
});

module.exports = cache;
