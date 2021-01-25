const asyncRetry = require('async-retry');

const retry = (fn) => asyncRetry(fn, {
    minTimeout: 500,
    onRetry: (err) => {
        const { method, url } = err.config;
        console.warn(`FAILED: ${method} - ${url}: ${err.code}`);
    },
    retries: process.env.RETRIES || 20,
});

module.exports = retry;
