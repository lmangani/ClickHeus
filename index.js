/*
 * Peafowl DPI Metrics
 *
 *
 */


var config = require('./config').config;
if (!config || !config.port || !config.endpoint) process.exit();

// Initialize Metrics Server
console.log('Initializing Metrics...');
const metrics = require('./lib/metrics').metrics;
metrics.start(config.port,config.host,config.endpoint);

console.log('Initializing connection...',config.clickhouse.host);
const click = require('./lib/click').click;
click.start(config.interface);

console.log('Click-Metrics is Running!');
