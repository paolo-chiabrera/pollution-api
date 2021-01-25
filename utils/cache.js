const cacheManager = require('cache-manager');
const memoryCache = cacheManager.caching({
    max: 100,
    refreshThreshold: 60, // seconds
    store: 'memory',
    ttl: 10 * 60, // seconds
});

module.exports = memoryCache;
