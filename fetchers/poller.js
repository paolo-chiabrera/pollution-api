const pQueue = require('p-queue').default;

const { POLLING_INTERVAL_SECONDS, QUEUE_CONCURRENCY } = process.env;

const { getCountries, setCountries } = require('./countries');
const { setCitiesByCountry } = require('./cities');
const { setAveragesByCountry } = require('./averages');
const { setLatestByCountry } = require('./latest');

const queue = new pQueue({ concurrency: parseInt(QUEUE_CONCURRENCY, 10) || 4 });

queue.onEmpty(() => {
    console.log('QUEUE: EMPTY');
});

const fetchData = async () => {
    try {
        const countries = await getCountries();

        queue.add(() => setCountries());

        countries.forEach(({ code }) => {
            queue.add(() => setCitiesByCountry(code));
            queue.add(() => setAveragesByCountry(code));
            queue.add(() => setLatestByCountry(code));
        });
    } catch (err) {
        console.error('fetchData', err);
    }
};

const run = () => {
    fetchData();

    setInterval(fetchData, (parseInt(POLLING_INTERVAL_SECONDS, 10) || 3600) * 1000);
};

module.exports = {
    run,
};
