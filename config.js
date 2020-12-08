var config = {
	"port": 3002,
	"host": "0.0.0.0",
	"endpoint": "/metrics",
        "debug": false,
	"clickhouse": {
		"host": "127.0.0.1",
		"port": 8123,
		"user": "default",
		"password": "password",
		"database": "my_database"
	},
	"queries":[],
	"prom_metrics": [],
	"refresh": 60000,
};


module.exports.config = config;
