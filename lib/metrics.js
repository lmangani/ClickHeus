// Metrics
var config = require('../config').config;
var metrics = {};

const client = require('prom-client');
metrics.client = client;
const register = client.register;

// Server
const fastify = require('fastify')()
fastify.get(config.endpoint, async (request, reply) => {
        reply.send(register.metrics());
});

metrics.start = function() {
	console.log('Starting '+config.endpoint+' on', config.host, 'port',config.port)
        const startServer = async () => {
          try {
            await fastify.listen(config.port,config.host)
          } catch (err) {
            console.log(err)
	    process.exit();
          }
        }
        startServer()
}

module.exports.metrics = metrics;

