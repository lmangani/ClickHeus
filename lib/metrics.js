// Metrics
var config = require('../config').config;
var metrics = {};

const client = require('prom-client');
const register = client.register;

const Gauge = client.Gauge;
metrics.g = new Gauge({
        name: 'hepic_click_trans_count',
        help: 'hepic transaction Count',
	maxAgeSeconds: config.refresh/1000| 60,
  	labelNames: [	"status",
			"xgroup",
			"ipgroup_in",
			"ipgroup_out",
			"usergroup",
			"server_type_in",
			"server_type_out"
	]
});
metrics.h = new client.Histogram({
  	name: 'hepic_click_trans_concurrent',
  	help: 'hepic transactions',
	maxAgeSeconds: config.refresh/1000 || 60,
  	labelNames: [	"status",
			"xgroup",
			"ipgroup_in",
			"ipgroup_out",
			"usergroup",
			"server_type_in",
			"server_type_out"
	]
});
metrics.s = new Gauge({
        name: 'hepic_click_second_count',
        help: 'hepic call second Count',
	maxAgeSeconds: config.refresh/1000| 60,
  	labelNames: [	"status",
			"xgroup",
			"ipgroup_in",
			"ipgroup_out",
			"usergroup",
			"server_type_in",
			"server_type_out"
	]
});


// Server
const fastify = require('fastify')()
fastify.get(config.endpoint, async (request, reply) => {
        reply.send(register.metrics());
	metrics.g.reset();
	metrics.s.reset();
	metrics.h.reset();
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

