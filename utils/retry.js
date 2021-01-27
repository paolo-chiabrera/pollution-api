const asyncRetry = require('async-retry');

const retry = (fn) => asyncRetry(fn, {
    minTimeout: 200,
    onRetry: (err) => {
        const { method, url } = err.config;
        console.warn(`FAILED: ${method} - ${url} | ${err}`);
    },
    retries: process.env.RETRIES || 10,
});

module.exports = retry;
