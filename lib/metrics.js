// Metrics
var config = require('../config').config;
var metrics = {};

const client = require('prom-client');
metrics.client = client;
const register = client.register;


var gateway = false;
// Optional Push GW
if(config.push && config.push.gateway){
  gateway = new client.Pushgateway(config.push.gateway);
}

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
module.exports.register = register;
module.exports.gateway = gateway;
