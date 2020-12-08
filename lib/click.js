/* CLICKHOUSE Helper */
var metrics = require('./metrics').metrics;
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
            if(result){
	      result.data.forEach(function(row){
		row = row.map(function(val, i) {return val === '' ? 'default' : val });
		var labels = "'" + row.slice(0, qset.counter_position-1).join("','")  + "'";
		var value = row[qset.counter_position];
		if (config.debug) console.log(labels,value);
		qset.metrics.forEach(function(metric){
			if (metrics[metric].set) { 
				// console.log('Ship Gauge');
				metrics[metric].labels(labels).set(parseInt(value));
			} else if (metrics[metric].observe) {
				// console.log('Ship Histogram');
				metrics[metric].labels(labels).observe(parseInt(value));
			}
		});
              });
	    } else {
		qset.metrics.forEach(function(metric){
		  if (config.debug) console.log('Reset Metric', metric);
		  metrics[metric].resetMetrics();
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
