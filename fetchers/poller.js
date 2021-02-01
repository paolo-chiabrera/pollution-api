const pQueue = require('p-queue').default;

const { POLLING_INTERVAL_SECONDS, QUEUE_CONCURRENCY } = process.env;

const { getCountries, setCountries } = require('./countries');
const { getCitiesByCountry, setCitiesByCountry } = require('./cities');
const { setAverages } = require('./averages');
const { setLatest } = require('./latest');

const queueCities = new pQueue({ concurrency: parseInt(QUEUE_CONCURRENCY, 10) || 2 });
const queueAverages = new pQueue({ concurrency: parseInt(QUEUE_CONCURRENCY, 10) || 2 });
const queueLatest = new pQueue({ concurrency: parseInt(QUEUE_CONCURRENCY, 10) || 2 });

const logQueueStatus = () => {
    console.log('\n--- Stats Queues ---');
    console.log(`Averages todo: ${queueAverages.size}`);
    console.log(`Cities todo: ${queueCities.size}`);
    console.log(`Latest todo: ${queueLatest.size}`);
    console.log('--- End ---\n');
};

const fetchData = async () => {
    try {
        const countries = await getCountries();

        setCountries();

        countries.forEach(async ({ code }) => {
            const cities = await getCitiesByCountry(code);

            queueCities.add(() => setCitiesByCountry(code));
            queueAverages.add(() => setAverages(code));

            cities.forEach(({ city }) => {
                queueLatest.add(() => setLatest(code, city));
            });
        });
    } catch (err) {
        console.error('fetchData', err);
    }
};

const run = () => {
    fetchData();

    setInterval(fetchData, (parseInt(POLLING_INTERVAL_SECONDS, 10) || 3600) * 1000);

    setInterval(logQueueStatus, 5 * 60 * 1000);
};

module.exports = {
    run,
};
