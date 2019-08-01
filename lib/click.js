/* CLICKHOUSE Helper */
var utils = require('./utils');
var metrics = require('./metrics').metrics;
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

var callStatus = [ "NULL", "INIT", "UNAUTHORIZED", "PROGRESS", "RINGING", "CONNECTED", "MOVED", "USER_BUSY",
		   "USER_FAILURE", "HARD_FAILURE", "FINISHED", "CANCELED", "TIMEOUT_TERMINATED", "BAD_TERMINATED", "DECLINE",
		   "UNKNOWN_TERMINATED"];
var query = {};

query.start = function(){
	function dataLoop(){
	  if (config.debug) console.log('Running Query!');
	  ch.query (config.query, {syncParser: true}, function (err, result) {
	    if(err) console.error('OUCH!',err);
	    if(result && config.debug) console.log(result);
            if(result){
	      result.data.forEach(function(row){
	      	metrics.h.labels(callStatus[row[0]],row[1],row[2],row[3],row[4],row[5],row[6]).observe(parseInt(row[7]));
	      	metrics.g.labels(callStatus[row[0]],row[1],row[2],row[3],row[4],row[5],row[6]).set(parseInt(row[7]));
              });
	    } else {
                metrics.h.resetMetrics();
                metrics.s.resetMetrics();
            }
	    // ReSpawn!
	    setTimeout(dataLoop, config.refresh || 10000);
	  });
        }
	dataLoop();
}

module.exports.click = query;
