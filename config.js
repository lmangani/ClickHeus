var query = "SELECT status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out, count(*) FROM sip_transaction_call FINAL PREWHERE record_datetime BETWEEN toDateTime(now()-60000)  AND toDateTime(now()) AND cdr_stop BETWEEN multiply(toUInt64(toDateTime(NOW()-60)), 1000000) AND toUInt64(toDateTime(NOW())) * 1000000 group by status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out"

var config = {
	"port": 3002,
	"host": "0.0.0.0",
	"endpoint": "/metrics",
        "debug": false,
	"clickhouse": {
		"host": "127.0.0.1",
		"port": 8123,
		"user": "default",
		"database": "hepic_data"
	},
	"refresh": 10000,
	"query": query
};


module.exports.config = config;
