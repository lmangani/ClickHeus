<img src="https://avatars2.githubusercontent.com/u/27866033?s=200&v=4">

# ClickHouse Metrics for Prometheus
<img src=https://user-images.githubusercontent.com/1423657/62568240-0e389700-b88d-11e9-8e7d-16d84be08ae9.png width=550>

Simple NodeJS application exposing ClickHouse query results as Prometheus metrics. It allows cross linking of multiple `queries` and `metric buckets` with recurring data intervals and simple mapping of `labels` and `values`.

##### Status
* Work in progress, tailored to `HEP` products. Do not use this for anything serious!

-------------

#### Example

##### Configuration
The following example illustrates mapping of `clickhouse` query columns to metric labels and values.

Configuring an emitter requires the following steps through the included `config.js` file:

###### 1: Define a Metrics Bucket
Using the `prom_metrics` array, define and name new `bucket` and its definitions. Type can be `gauge` or `histogram`
```
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
	],
```

###### 2: Define a Query
Using the `queries` array, define a new `clickhouse` query to execute and associate it with metrics bucket `g`

Place your value last in your query, and mark its position using the `counter_position` parameter.
```
"queries":[
		{
			"name": "call_status",
			"query": "SELECT status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out, count(*) FROM sip_transaction_call FINAL PREWHERE record_datetime BETWEEN toDateTime(now()-60000)  AND toDateTime(now()) AND cdr_stop BETWEEN multiply(toUInt64(toDateTime(NOW()-60)), 1000000) AND toUInt64(toDateTime(NOW())) * 1000000 group by status, xgroup, ipgroup_in, ipgroup_out, usergroup, server_type_in, server_type_out",
			"counter_position": 7,
			"refresh": 60000,
			"metrics": ["g"]
		},
	],
```

###### 3: Output Metrics
Connect to the configured `/metrics` HTTP endpoint defined in your configuration and await data
```
# HELP hepic_click_trans_count hepic transaction Count
# TYPE hepic_click_trans_count gauge
hepic_click_trans_count{status="FINISHED",xgroup="default",ipgroup_in="default",ipgroup_out="default",usergroup="default",server_type_in="default",server_type_out="default"} 1
```


---------

## Credits
This project is sponsored by [QXIP](https://github.com/qxip) and [HEPIC](http://hepic.tel)
