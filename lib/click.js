/* CLICKHOUSE Helper */
var metrics = require('./metrics').metrics;
var register = require('./metrics').register;
var client = require('./metrics').metrics.client;
var config = require('../config').config;

var ClickHouse = require('@apla/clickhouse');
var options = {
  host: config.clickhouse.host || '127.0.0.1',
  port: config.clickhouse.port || 8123,
  queryOptions: {
    database: config.clickhouse.database
  },
  omitFormat: false,
  readonly: true
};

if (config.clickhouse.user) options.queryOptions.user = config.clickhouse.user;
if (config.clickhouse.password) options.queryOptions.password = config.clickhouse.password;
var ch = new ClickHouse(options);

// Optional Push GW
if(config.push && config.push.gateway) var gateway = require('./metrics').gateway;

// Prepare Metric Buckets
const Gauge = client.Gauge;
const Histogram = client.Histogram;
  if (config.prom_metrics){
    config.prom_metrics.forEach(function(metric){
	  if(metric.type == "gauge"){
		metrics[metric.name] = new Gauge(metric.settings);
	  } else if(metric.type == "histogram"){
		metrics[metric.name] = new Histogram(metric.settings);
	  }
    });
  }

// Prepare Query Runner
var query = {};
query.start = function(){
  function dataLoop(){
    if(config.queries){
	config.queries.forEach(function(qset){
	  if (config.debug) console.log('Running Query!',qset);
	  ch.query(qset.query, {syncParser: true}, function (err, result) {
	    if(err) console.error('OUCH!',err);
	    if(result && config.debug) console.log(result);
            if(result && result.data.length > 0){
	      result.data.forEach(function(row){
 		var labels = {};
		var value = row[qset.counter_position];
		row = row.slice(0, qset.counter_position);
		row = row.map(function(val, i) {return val === '' ? 'default' : val });
		row.forEach(function(item,i){
			labels[result.meta[i].name] = item;
		});
		qset.metrics.forEach(function(metric){
			if (metrics[metric].set) {
				if (config.debug) console.log('Ship Gauge',labels,value);
				//metrics[metric].labels(labels).set(parseFloat(value));
				metrics[metric].set(labels, parseFloat(value));
			} else if (metrics[metric].observe) {
				if (config.debug) console.log('Ship Histogram',labels,value);
				metrics[metric].labels(labels).observe(parseFloat(value));
				//metrics[metric].observe(labels, parseFloat(value));
			}
		});
              });
              // PUSH SUPPORT TBD!

	    } else {
		qset.metrics.forEach(function(metric){
		  if (config.debug) console.log('Reset Metric', metric);
		  //metrics[metric].set(0);
		  register.resetMetrics();
		});
            }
	    // ReSpawn!
	    setTimeout(dataLoop, qset.refresh || config.refresh || 10000);
	  });
	});
    }
  }
  dataLoop();
}

module.exports.click = query;
