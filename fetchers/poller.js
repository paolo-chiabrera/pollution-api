const pQueue = require('p-queue').default;

const { POLLING_INTERVAL_SECONDS, QUEUE_CONCURRENCY } = process.env;

const { getCountries, setCountries } = require('./countries');
const { getCitiesByCountry, setCitiesByCountry } = require('./cities');
const { setAverages } = require('./averages');
const { setLatest } = require('./latest');

const queue = new pQueue({ concurrency: parseInt(QUEUE_CONCURRENCY, 10) || 8 });

queue.onEmpty(() => {
    console.log('QUEUE: EMPTY');
});

const fetchData = async () => {
    try {
        const countries = await getCountries();

        queue.add(() => setCountries());

        countries.forEach(async ({ code }) => {
            const cities = await getCitiesByCountry(code);

            queue.add(() => setCitiesByCountry(code));

            cities.forEach(({ name }) => {
                queue.add(() => setAverages(code, name));
                queue.add(() => setLatest(code, name));
            });
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
