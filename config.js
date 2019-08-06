var config = {
	"port": 3002,
	"host": "0.0.0.0",
	"endpoint": "/metrics",
        "debug": false,
	"clickhouse": {
		"host": "127.0.0.1",
		"port": 8123,
		"user": "default",
		"password": "1dz0HEAC",
		"database": "hepic_data"
	},
	"queries":[
		{
			"name": "call_status",
			"query": "SELECT status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out, count(*) FROM sip_transaction_call FINAL PREWHERE record_datetime BETWEEN toDateTime(now()-60000)  AND toDateTime(now()) AND cdr_stop BETWEEN multiply(toUInt64(toDateTime(NOW()-60)), 1000000) AND toUInt64(toDateTime(NOW())) * 1000000 group by status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out",
			"labels": ["status", "xgroup", "ipgroup_in", "ipgroup_out", "usergroup", "server_type_in", "server_type_out"],
			"counter_position": 7,
			"refresh": 60000,
			"metrics": ["g", "h"]
		},
		{
			"name": "call_seconds",
			"query": "SELECT status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out, sum(duration) FROM sip_transaction_call FINAL PREWHERE status = 10 AND record_datetime BETWEEN toDateTime(now()-60000)  AND toDateTime(now()) AND cdr_stop BETWEEN multiply(toUInt64(toDateTime(NOW()-60)), 1000000) AND toUInt64(toDateTime(NOW())) * 1000000 group by status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out",
			"labels": ["status", "xgroup", "ipgroup_in", "ipgroup_out", "usergroup", "server_type_in", "server_type_out"],
			"counter_position": 7,
			"refresh": 60000,
			"metrics": ["s"]
		}
	],
	"prom_metrics": [
		{ "name": "g", 
		  "type": "gauge",
		  "settings": {
		        name: 'hepic_click_trans_count',
		        help: 'hepic transaction Count',
		        maxAgeSeconds: 60,
		        labelNames: [   
				"status",
	                        "xgroup",
	                        "ipgroup_in",
	                        "ipgroup_out",
	                        "usergroup",
	                        "server_type_in",
	                        "server_type_out"
		        ]
		  }
		},
		{ "name": "s", 
		  "type": "gauge",
		  "settings": {
		        name: 'hepic_click_seconds_count',
		        help: 'hepic call Seconds Count',
		        maxAgeSeconds: 60,
		        labelNames: [   
				"status",
	                        "xgroup",
	                        "ipgroup_in",
	                        "ipgroup_out",
	                        "usergroup",
	                        "server_type_in",
	                        "server_type_out"
		        ]
		  }
		},
		{ "name": "h", 
		  "type": "histogram",
		  "settings": {
		        name: 'hepic_click_trans_concurrent',
		        help: 'hepic transactions',
		        maxAgeSeconds: 60,
		        labelNames: [   
				"status",
	                        "xgroup",
	                        "ipgroup_in",
	                        "ipgroup_out",
	                        "usergroup",
	                        "server_type_in",
	                        "server_type_out"
		        ]
		  }
		},
	],
	"refresh": 60000,
};


module.exports.config = config;
