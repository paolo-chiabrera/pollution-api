const pQueue = require('p-queue').default;

const { CACHE_TTL_SECONDS, QUEUE_CONCURRENCY } = process.env;

const getCountries = require('./countries');
const { getAveragesByCountryCached } = require('./averages');
const { getLatestByCountryCached } = require('./latest');

const queue = new pQueue({ concurrency: parseInt(QUEUE_CONCURRENCY, 10) || 4 });

queue.onEmpty(() => {
    console.log('Queue EMPTY!');
});

const fetchData = () => getCountries()
    .then((countries) => {
        console.log(`Fetched countries: ${countries.length}`);

        countries.forEach(({ code }) => {
            queue.add(() => getAveragesByCountryCached(code));
            queue.add(() => getLatestByCountryCached(code));
        });
    })
    .catch(console.error);

const run = () => {
    fetchData();

    setInterval(fetchData, (parseInt(CACHE_TTL_SECONDS, 10) || 60 * 60) / 2 * 1000);
};

module.exports = {
    run,
};
